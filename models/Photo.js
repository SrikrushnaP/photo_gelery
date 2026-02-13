import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  faceId: [{ type: String }],
  imageUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  externalImageId: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});

export default mongoose.model('Photo', photoSchema);
