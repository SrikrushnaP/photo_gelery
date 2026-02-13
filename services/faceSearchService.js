import { SearchFacesByImageCommand } from '@aws-sdk/client-rekognition';
import { rekognitionClient } from '../config/aws.js';
import { COLLECTION_ID } from './collectionService.js';

export const searchFacesByImage = async (file) => {
  const command = new SearchFacesByImageCommand({
    CollectionId: COLLECTION_ID,
    Image: {
      Bytes: file.buffer,
    },
    MaxFaces: 10,
    FaceMatchThreshold: 80,
  });

  const response = await rekognitionClient.send(command);
  return response.FaceMatches.map(match => ({
    faceId: match.Face.FaceId,
    similarity: match.Similarity,
  }));
};
