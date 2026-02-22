import mongoose, { Schema, Document } from 'mongoose';

export interface IDashboard extends Document {
  hero: {
    title: string;
    subtitle: string;
    image: string;
    primaryCTA: { label: string; link: string };
    secondaryCTA: { label: string; link: string };
  };
  initiatives: Array<{ title: string; description: string; image: string }>;
  feedback: Array<{ name: string; role: string; quote: string; avatar?: string }>;
  impact: Array<{ label: string; value: string }>;
  cta: { title: string; description: string; buttonText: string; link: string };
  testimonials: Array<{ name: string; role: string; quote: string; avatar?: string }>;
  storySection: {
    title: string;
    description: string;
    image: string;
    link: string;
  };
  footer: {
    supportLinks: Array<{ label: string; link: string }>;
    quickLinks: Array<{ label: string; link: string }>;
    legalLinks: Array<{ label: string; link: string }>;
    socialLinks: Array<{ platform: string; link: string }>;
  };
  isActive: boolean;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const DashboardSchema = new Schema<IDashboard>(
  {
    hero: {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      image: { type: String, required: true },
      primaryCTA: {
        label: { type: String, required: true },
        link: { type: String, required: true }
      },
      secondaryCTA: {
        label: { type: String, required: true },
        link: { type: String, required: true }
      }
    },
    initiatives: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, default: "/photo1.png" }
      }
    ],
    feedback: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
        quote: { type: String, required: true },
        avatar: { type: String, default: "" }
      }
    ],
    impact: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true }
      }
    ],
    cta: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      buttonText: { type: String, required: true },
      link: { type: String, required: true }
    },
    testimonials: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
        quote: { type: String, required: true },
        avatar: { type: String, default: "" }
      }
    ],
    storySection: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      image: { type: String, default: "" },
      link: { type: String, default: "/stories" }
    },
    footer: {
      supportLinks: [
        {
          label: { type: String, required: true },
          link: { type: String, required: true }
        }
      ],
      quickLinks: [
        {
          label: { type: String, required: true },
          link: { type: String, required: true }
        }
      ],
      legalLinks: [
        {
          label: { type: String, required: true },
          link: { type: String, required: true }
        }
      ],
      socialLinks: [
        {
          platform: { type: String, required: true },
          link: { type: String, required: true }
        }
      ]
    },
    isActive: { type: Boolean, default: true },
    updatedBy: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Dashboard || mongoose.model('Dashboard', DashboardSchema);