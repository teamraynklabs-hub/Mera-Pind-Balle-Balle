"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { User } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";

interface TeamMember {
  name: string;
  role: string;
  description?: string;
  image?: string;
}

interface AboutTeamProps {
  sectionTitle?: string;
  sectionSubtitle?: string;
  members?: TeamMember[];
}

const FALLBACK_MEMBERS: TeamMember[] = [
  { name: "Priya Sharma", role: "Founder & CEO", description: "Passionate about rural empowerment and bridging the gap between traditional artisans and modern markets.", image: "" },
  { name: "Amit Verma", role: "Head of Operations", description: "Ensures smooth supply chain management and quality control, connecting villages with customers nationwide.", image: "" },
  { name: "Neha Kaur", role: "Community Manager", description: "Works closely with artisan communities to understand their needs and drive impactful skill-building programs.", image: "" },
  { name: "Rajesh Patel", role: "Technology Lead", description: "Building the digital platform that empowers artisans with visibility and direct access to global customers.", image: "" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function AboutTeam({ sectionTitle, sectionSubtitle, members }: AboutTeamProps) {
  const heading = sectionTitle || "Meet Our Team";
  const subtitle = sectionSubtitle || "Passionate individuals working to create meaningful change";
  const teamMembers = members && members.length > 0 ? members : FALLBACK_MEMBERS;

  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-28">
      <ScrollReveal className="text-center mb-14">
        <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-3">
          The People Behind the Mission
        </p>
        <h2
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {heading}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {teamMembers.map((member, i) => {
          const hasImage = member.image && member.image.trim() !== "";

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className="group rounded-2xl bg-card border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-deep)] hover:-translate-y-1.5 transition-all duration-500 overflow-hidden"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                {hasImage ? (
                  <Image
                    src={member.image!}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                    <User size={64} className="text-primary/20" strokeWidth={1} />
                  </div>
                )}
              </div>

              <div className="p-5 sm:p-6">
                <h3
                  className="text-lg font-semibold leading-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {member.name}
                </h3>
                <p className="text-primary text-sm font-medium mt-1">{member.role}</p>
                {member.description && (
                  <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
                    {member.description}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
