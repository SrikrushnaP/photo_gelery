import { CreateCollectionCommand, DescribeCollectionCommand } from '@aws-sdk/client-rekognition';
import { rekognitionClient } from '../config/aws.js';

const COLLECTION_ID = 'personal-photo-collection';

export const ensureCollectionExists = async () => {
  try {
    await rekognitionClient.send(new DescribeCollectionCommand({
      CollectionId: COLLECTION_ID,
    }));
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      await rekognitionClient.send(new CreateCollectionCommand({
        CollectionId: COLLECTION_ID,
      }));
    } else {
      throw error;
    }
  }
};

export const validateCollection = async () => {
  try {
    await rekognitionClient.send(new DescribeCollectionCommand({
      CollectionId: COLLECTION_ID,
    }));
    return true;
  } catch (error) {
    return false;
  }
};

export { COLLECTION_ID };
