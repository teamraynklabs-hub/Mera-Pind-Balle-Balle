"use client";

import { motion } from "motion/react";
import { Download, FileText, Film, Image as ImageIcon } from "lucide-react";
import type { Resource } from "./resourcesData";

function getFileIcon(fileType: string) {
  switch (fileType.toLowerCase()) {
    case "video":
      return Film;
    case "image":
      return ImageIcon;
    default:
      return FileText;
  }
}

function getFileLabel(fileType: string) {
  switch (fileType.toLowerCase()) {
    case "pdf":
      return "PDF";
    case "video":
      return "MP4";
    case "image":
      return "IMG";
    default:
      return fileType.toUpperCase();
  }
}

interface ResourcesCardProps {
  resource: Resource;
  index: number;
}

export default function ResourcesCard({ resource, index }: ResourcesCardProps) {
  const Icon = getFileIcon(resource.fileType);
  const fileLabel = getFileLabel(resource.fileType);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      layout
      className="group rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_oklch(0_0_0/0.12),0_4px_8px_oklch(0_0_0/0.06)] hover:-translate-y-1"
    >
      {/* Top: Icon area */}
      <div className="relative h-44 flex items-center justify-center bg-gradient-to-br from-[var(--gold)]/10 via-[var(--gold)]/5 to-transparent">
        <div className="w-16 h-16 rounded-full bg-[var(--gold)]/15 flex items-center justify-center">
          <Icon className="w-8 h-8 text-[var(--gold)]" strokeWidth={1.5} />
        </div>

        {/* File type badge */}
        <span className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-md bg-[var(--gold)]/20 text-[var(--gold)] backdrop-blur-sm">
          {fileLabel}
        </span>
      </div>

      {/* Bottom: Content area */}
      <div className="p-5 pt-4 flex flex-col gap-3">
        {/* Category badge */}
        <span className="inline-flex w-fit px-3 py-1 text-xs font-medium rounded-md bg-muted text-muted-foreground border border-border">
          {resource.category}
        </span>

        {/* Title */}
        <h3
          className="text-lg font-semibold leading-snug line-clamp-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {resource.description}
        </p>

        {/* Meta: Size + Date */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span>{resource.size}</span>
          <span>{resource.date}</span>
        </div>

        {/* Download Button */}
        <a
          href={resource.fileUrl}
          download
          className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[var(--gold)] text-[var(--gold-foreground)] font-medium text-sm transition-all duration-300 hover:shadow-[0_0_20px_var(--gold)/30] hover:brightness-110 active:scale-[0.98]"
        >
          <Download size={16} />
          Download
        </a>
      </div>
    </motion.article>
  );
}
