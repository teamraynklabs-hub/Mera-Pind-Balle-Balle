"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

/**
 * 🔐 AUTO-LOGOUT ON INACTIVITY
 * Logs out user after 15 minutes of no activity
 */
export function useActivityTimeout(timeoutMinutes = 15) {
  const router = useRouter();
  const { data: session } = useSession();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (session?.user?.role !== "admin") return;

    const timeoutMs = timeoutMinutes * 60 * 1000;
    const warningMs = (timeoutMinutes - 2) * 60 * 1000; // Warn 2 mins before

    function resetTimeout() {
      // Clear existing timeouts
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);

      // Set warning timeout
      warningTimeoutRef.current = setTimeout(() => {
        console.warn("⚠️ Session will expire in 2 minutes due to inactivity");
      }, warningMs);

      // Set logout timeout
      timeoutRef.current = setTimeout(async () => {
        console.log("🔴 Logging out due to inactivity...");
        
        // Logout via API
        await fetch("/api/auth/logout", { method: "POST" });
        
        // Redirect to login
        router.push("/admin-login");
      }, timeoutMs);
    }

    // Activity listeners
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];
    
    events.forEach((event) => {
      document.addEventListener(event, resetTimeout);
    });

    // Initial timeout setup
    resetTimeout();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, resetTimeout);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, [session, router, timeoutMinutes]);
}
