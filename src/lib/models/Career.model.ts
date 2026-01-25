import { Schema, model, models } from "mongoose";

const JobSchema = new Schema(
  {
    title: String,
    location: String,
    type: String,
    description: String,
    salary: {type: String, default: ''},
    image: { type: String, default: '' }, 
  },
  { _id: true }
);

const CareersPageSchema = new Schema(
  {
    bannerImage: { 
      type: String, 
      default: "https://via.placeholder.com/1200x400?text=Careers+Banner",
      required: false
    },

    jobs: {
      type: [JobSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default models.CareersPage ||
  model("CareersPage", CareersPageSchema);
