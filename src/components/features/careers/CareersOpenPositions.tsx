"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";

const ease = [0.16, 1, 0.3, 1] as const;

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  isHiring: boolean;
}

const DUMMY_JOBS: Job[] = [
  {
    id: "1",
    title: "Artisan Relations Manager",
    department: "Operations",
    location: "Gurugram, Haryana",
    type: "Full-time",
    description:
      "Build and maintain relationships with rural artisan communities. Coordinate training programs and ensure quality standards.",
    isHiring: true,
  },
  {
    id: "2",
    title: "Digital Marketing Specialist",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description:
      "Drive online presence through SEO, social media, and content marketing. Tell compelling artisan stories.",
    isHiring: true,
  },
  {
    id: "3",
    title: "Supply Chain Coordinator",
    department: "Logistics",
    location: "Punjab, India",
    type: "Full-time",
    description:
      "Manage end-to-end logistics from artisan clusters to customers. Optimize delivery and inventory systems.",
    isHiring: true,
  },
  {
    id: "4",
    title: "UI/UX Designer",
    department: "Product",
    location: "Remote",
    type: "Contract",
    description:
      "Design intuitive and beautiful user experiences for our e-commerce platform and mobile applications.",
    isHiring: true,
  },
  {
    id: "5",
    title: "Community Development Lead",
    department: "Impact",
    location: "Rural Punjab",
    type: "Full-time",
    description:
      "Lead community engagement and women's skill development programs across multiple villages.",
    isHiring: true,
  },
];

export default function CareersOpenPositions() {
  const [jobs, setJobs] = useState<Job[]>(DUMMY_JOBS);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/careers");
        if (!res.ok) return;
        const data = await res.json();
        if (data?.data?.jobs?.length > 0) {
          setJobs(
            data.data.jobs.map((job: any, i: number) => ({
              id: job._id || String(i),
              title: job.title,
              department: job.department || "General",
              location: job.location || "Remote",
              type: job.type || "Full-time",
              description: job.description,
              isHiring: true,
            }))
          );
        }
      } catch {
        // keep dummy data
      }
    }
    fetchJobs();
  }, []);

  const scrollToForm = () => {
    const form = document.getElementById("career-application-form");
    if (form) form.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-primary/[0.06] to-primary/[0.03]" />

      <div className="relative container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
        <ScrollReveal className="text-center mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Open Positions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Find your perfect role and join our growing team
          </p>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {jobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
              className="group relative p-6 sm:p-8 rounded-2xl bg-card border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] hover:-translate-y-1 transition-all duration-500"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h3
                    className="text-xl font-semibold mb-2 text-[var(--gold)]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase size={14} />
                      {job.department}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={14} />
                      {job.type}
                    </span>
                  </div>
                </div>

                {job.isHiring && (
                  <span className="inline-flex items-center self-start px-3 py-1 rounded-full text-xs font-medium bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20 whitespace-nowrap">
                    Now Hiring
                  </span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-5">
                {job.description}
              </p>

              <button
                onClick={scrollToForm}
                className="group/btn inline-flex items-center gap-2 text-sm font-medium text-[var(--gold)] hover:text-[var(--gold)]/80 transition-colors duration-300"
              >
                Apply Now
                <ArrowRight
                  size={16}
                  className="group-hover/btn:translate-x-1 transition-transform duration-300"
                />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
