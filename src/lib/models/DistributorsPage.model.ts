// lib/models/DistributorsPage.ts
import { Schema, model, models } from 'mongoose';

const DistributorsPageSchema = new Schema(
  {
    bannerImage: { type: String, required: true }, // Cloudinary URL
    benefits: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.DistributorsPage || model('DistributorsPage', DistributorsPageSchema);