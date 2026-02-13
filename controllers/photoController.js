import Photo from '../models/Photo.js';
import { uploadToS3 } from '../services/s3Service.js';
import { indexFacesFromBytes } from '../services/faceIndexService.js';
import { searchFacesByImage } from '../services/faceSearchService.js';
import { ensureCollectionExists } from '../services/collectionService.js';
import { getRefreshedUrl } from '../services/urlRefreshService.js';

export const uploadPhoto = async (req, res) => {
  try {
    await ensureCollectionExists();
    
    const { key } = await uploadToS3(req.file);
    const faceIds = await indexFacesFromBytes(req.file.buffer, key);

    const photo = await Photo.create({
      faceId: faceIds,
      s3Key: key,
      fileName: req.file.originalname,
    });

    res.status(201).json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchPhoto = async (req, res) => {
  try {
    const matches = await searchFacesByImage(req.file);
    const faceIds = matches.map(m => m.faceId);

    const photos = await Photo.find({ faceId: { $in: faceIds } });

    const photosWithUrls = await Promise.all(
      photos.map(async (photo) => {
        const key = photo.s3Key || photo.externalImageId;
        return {
          imageUrl: await getRefreshedUrl(key),
          fileName: photo.fileName,
          uploadDate: photo.uploadDate,
        };
      })
    );

    res.json({ matches: photosWithUrls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ uploadDate: -1 });
    
    const photosWithUrls = await Promise.all(
      photos.map(async (photo) => {
        const key = photo.s3Key || photo.externalImageId;
        return {
          _id: photo._id,
          imageUrl: await getRefreshedUrl(key),
          fileName: photo.fileName,
          uploadDate: photo.uploadDate,
          faceId: photo.faceId,
        };
      })
    );

    res.json(photosWithUrls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
