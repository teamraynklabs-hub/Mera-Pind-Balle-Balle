"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider basePath="/api/auth" refetchInterval={0}>
      {children}
    </SessionProvider>
  );
}
