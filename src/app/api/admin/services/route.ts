// app/api/services/route.ts
import { NextResponse } from "next/server";
import Service from "@/lib/models/Service.model";   // adjust path if needed
import { connectDB } from "@/lib/db";     // your DB connection helper

export async function GET() {
  try {
    await connectDB();
    const services = await Service.find({}).lean(); // lean() = faster + plain objects
    return NextResponse.json(services);             // ← always returns array []
  } catch (error) {
    console.error("GET /api/services failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Optional: keep POST/PATCH/DELETE if you already have them