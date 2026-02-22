import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import NavbarSettings from "@/lib/models/NavbarSettings.model";
import {
  normalizeNavbarSettings,
  NAVBAR_SEED_DATA,
} from "@/lib/normalizeNavbarSettings";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
};

export async function GET() {
  try {
    await connectDB();
    const settings = await NavbarSettings.findOne({ isActive: true }).lean();

    if (!settings) {
      return NextResponse.json(
        { success: true, data: NAVBAR_SEED_DATA },
        { headers: CACHE_HEADERS }
      );
    }

    const normalized = normalizeNavbarSettings(settings) || NAVBAR_SEED_DATA;

    return NextResponse.json(
      { success: true, data: normalized },
      { headers: CACHE_HEADERS }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch navbar settings" },
      { status: 500 }
    );
  }
}
