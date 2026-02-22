import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { AdminSessionProvider } from "@/components/admin/AdminSessionProvider";
import { ModeToggle } from "@/components/ui/toggleBtn";
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // 🔐 STRICT SESSION CHECK
  if (!session || !session.user || session.user.role !== "admin") {
    redirect("/admin-login");
  }

  return (
    <AdminSessionProvider>
      <div className="min-h-screen flex flex-col">
        {/* MAIN CONTENT */}
        <div className="flex-1">
          {children}
          <Toaster richColors position="top-right" />
        </div>
      </div>
    </AdminSessionProvider>
  );
}
