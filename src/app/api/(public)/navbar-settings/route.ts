import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import NavbarSettings from "@/lib/models/NavbarSettings.model";
import {
  normalizeNavbarSettings,
  NAVBAR_SEED_DATA,
} from "@/lib/normalizeNavbarSettings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const settings = await NavbarSettings.findOne({ isActive: true }).lean();

    if (!settings) {
      return NextResponse.json(
        { success: true, data: NAVBAR_SEED_DATA },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        }
      );
    }

    const normalized = normalizeNavbarSettings(settings) || NAVBAR_SEED_DATA;

    return NextResponse.json(
      { success: true, data: normalized },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch navbar settings" },
      { status: 500 }
    );
  }
}
