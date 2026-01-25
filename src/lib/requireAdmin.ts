// lib/requireAdmin.ts
import { auth } from "@/auth"; // ← new import from auth.ts
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized - Admin access required" },
      { status: 401 }
    );
  }

  return session; // optional: return session if needed in route
}