import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const jsonPath = path.join(
      process.cwd(),
      "src",
      "lib",
      "dummy",
      "products.json"
    );

    const raw = fs.readFileSync(jsonPath, "utf8");
    const data = JSON.parse(raw);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("PRODUCTS API ERROR:", error.message);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}
