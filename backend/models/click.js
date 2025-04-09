import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  linkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Link', required: true, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  // Optional parsed fields
  // browser: { type: String },
  // os: { type: String },
  // device: { type: String },
});

const Click = mongoose.model('Click', clickSchema);
export default Click;
