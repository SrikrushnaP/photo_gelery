import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database.js';
import { ensureCollectionExists } from './services/collectionService.js';
import photoRoutes from './routes/photoRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/photos', photoRoutes);

const PORT = process.env.PORT || 3000;

connectDB().then(async () => {
  try {
    await ensureCollectionExists();
    console.log('Rekognition collection initialized');
  } catch (error) {
    console.error('Warning: Could not initialize Rekognition collection:', error.message);
    console.log('Server will start anyway. Collection will be created on first upload.');
  }
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
