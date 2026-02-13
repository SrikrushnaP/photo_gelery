import Photo from '../models/Photo.js';
import { uploadToS3 } from '../services/s3Service.js';
import { indexFacesFromBytes } from '../services/faceIndexService.js';
import { searchFacesByImage } from '../services/faceSearchService.js';
import { ensureCollectionExists } from '../services/collectionService.js';

export const uploadPhoto = async (req, res) => {
  try {
    await ensureCollectionExists();
    
    const { key, url } = await uploadToS3(req.file);
    const faceIds = await indexFacesFromBytes(req.file.buffer, key);

    const photo = await Photo.create({
      faceId: faceIds,
      imageUrl: url,
      fileName: req.file.originalname,
      externalImageId: key,
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

    res.json({
      matches: photos.map(photo => ({
        imageUrl: photo.imageUrl,
        fileName: photo.fileName,
        uploadDate: photo.uploadDate,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ uploadDate: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
