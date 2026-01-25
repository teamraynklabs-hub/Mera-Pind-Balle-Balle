// lib/models/Distributor.ts
import { Schema, model, models } from 'mongoose';

const DistributorSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Distributor name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String, // Cloudinary secure_url
      default: '',
    },
    publicId: {          
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

DistributorSchema.index({ name: 'text', email: 'text' });

export default models.Distributor || model('Distributor', DistributorSchema);