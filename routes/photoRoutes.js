import express from 'express';
import { uploadPhoto, searchPhoto, getAllPhotos } from '../controllers/photoController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/upload-photo', upload.single('photo'), uploadPhoto);
router.post('/search-photo', upload.single('photo'), searchPhoto);
router.get('/photos', getAllPhotos);

export default router;
