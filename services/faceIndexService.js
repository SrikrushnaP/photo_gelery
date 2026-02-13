import { IndexFacesCommand } from '@aws-sdk/client-rekognition';
import { rekognitionClient } from '../config/aws.js';
import { COLLECTION_ID } from './collectionService.js';

export const indexFacesFromBytes = async (imageBuffer, s3Key) => {
  // Convert S3 key to valid externalImageId (replace / with -)
  const externalImageId = s3Key.replace(/\//g, '-');
  
  const command = new IndexFacesCommand({
    CollectionId: COLLECTION_ID,
    Image: {
      Bytes: imageBuffer,
    },
    ExternalImageId: externalImageId,
    DetectionAttributes: ['ALL'],
  });

  const response = await rekognitionClient.send(command);
  return response.FaceRecords.map(record => record.Face.FaceId);
};
