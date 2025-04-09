// backend/models/Link.js
import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortId: { type: String, required: true, unique: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }, // Optional expiration
});

const Link = mongoose.model('Link', linkSchema);
export default Link;
