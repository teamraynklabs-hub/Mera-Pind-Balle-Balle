"use client";

import { ReactNode } from "react";
import { useActivityTimeout } from "@/hooks/useActivityTimeout";

/**
 * 🔐 ADMIN SESSION PROTECTION PROVIDER
 * Wraps admin pages to enforce session timeout and activity monitoring
 */
export function AdminSessionProvider({ children }: { children: ReactNode }) {
  // Auto-logout after 15 minutes of inactivity
  useActivityTimeout(15);

  return <>{children}</>;
}
