import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { AdminSessionProvider } from "@/components/admin/AdminSessionProvider";
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
        {/* ADMIN HEADER WITH LOGOUT */}
        <header className="bg-black-900 text-white p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-slate-400">
              Logged in as: {session.user.email}
            </p>
          </div>
          <AdminLogoutButton />
        </header>

        {/* MAIN CONTENT */}
        <div className="flex-1">
          {children}
          <Toaster richColors position="top-right" />
        </div>
      </div>
    </AdminSessionProvider>
  );
}
