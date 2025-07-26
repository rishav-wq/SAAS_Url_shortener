import mongoose from 'mongoose';

const customDomainSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  domain: { type: String, required: true, unique: true, lowercase: true },
  subdomain: { type: String }, // Optional subdomain like 'links' in links.company.com
  fullDomain: { type: String, required: true, unique: true }, // Complete domain
  status: { 
    type: String, 
    enum: ['pending', 'verified', 'failed', 'suspended'], 
    default: 'pending' 
  },
  verificationMethod: { 
    type: String, 
    enum: ['dns', 'file'], 
    default: 'dns' 
  },
  verificationToken: { type: String, required: true },
  sslStatus: { 
    type: String, 
    enum: ['pending', 'active', 'failed'], 
    default: 'pending' 
  },
  sslCertificate: {
    issuer: String,
    expiresAt: Date,
    fingerprint: String
  },
  dnsRecords: [{
    type: { type: String, enum: ['A', 'CNAME', 'TXT'] },
    name: String,
    value: String,
    verified: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date },
  lastChecked: { type: Date }
});

// Index for efficient lookups
customDomainSchema.index({ fullDomain: 1 });
customDomainSchema.index({ userId: 1 });

const CustomDomain = mongoose.model('CustomDomain', customDomainSchema);
export default CustomDomain;
