import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../config/aws.js';

export const uploadToS3 = async (file) => {
  // Sanitize filename: remove invalid characters for Rekognition externalImageId
  const sanitizedFilename = file.originalname
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.+/g, '.');
  
  const key = `photos/${Date.now()}-${sanitizedFilename}`;
  
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));

  const url = await getSignedUrl(s3Client, new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  }), { expiresIn: 3600 });

  return { key, url };
};
