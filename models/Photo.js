import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  faceId: [{ type: String }],
  s3Key: { type: String },
  externalImageId: { type: String }, // For backward compatibility
  fileName: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});

export default mongoose.model('Photo', photoSchema);
