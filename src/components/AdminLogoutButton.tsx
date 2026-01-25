"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    // Ask for confirmation
    if (!confirm("Are you sure you want to log out?")) {
      return;
    }

    setIsLoading(true);

    try {
      // Call the logout API
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        console.log("✅ Session destroyed, redirecting to login...");
        
        // Clear localStorage if any auth data is stored
        localStorage.clear();
        sessionStorage.clear();

        // Redirect to login page
        router.push("/admin-login");
        
        // Ensure session is cleared
        setTimeout(() => {
          window.location.href = "/admin-login";
        }, 500);
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      disabled={isLoading}
      className="flex gap-2 cursor-pointer"
    >
      <LogOut size={18} />
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}
