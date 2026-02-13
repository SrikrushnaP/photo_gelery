import { S3Client } from '@aws-sdk/client-s3';
import { RekognitionClient } from '@aws-sdk/client-rekognition';

let s3ClientInstance = null;
let rekognitionClientInstance = null;

const getS3Config = () => ({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const getRekognitionConfig = () => ({
  region: process.env.AWS_REKOGNITION_REGION || process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const getS3Client = () => {
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client(getS3Config());
  }
  return s3ClientInstance;
};

export const getRekognitionClient = () => {
  if (!rekognitionClientInstance) {
    rekognitionClientInstance = new RekognitionClient(getRekognitionConfig());
  }
  return rekognitionClientInstance;
};

// For backward compatibility
export const s3Client = new Proxy({}, {
  get: (target, prop) => getS3Client()[prop]
});

export const rekognitionClient = new Proxy({}, {
  get: (target, prop) => getRekognitionClient()[prop]
});
