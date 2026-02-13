import dotenv from 'dotenv';
import { RekognitionClient, ListCollectionsCommand } from '@aws-sdk/client-rekognition';

dotenv.config();

const client = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

try {
  const command = new ListCollectionsCommand({});
  const response = await client.send(command);
  console.log('✅ AWS Rekognition connection successful!');
  console.log('Collections:', response.CollectionIds);
} catch (error) {
  console.error('❌ AWS Rekognition connection failed:', error.message);
}
