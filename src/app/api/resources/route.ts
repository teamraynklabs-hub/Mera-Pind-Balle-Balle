import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "src",
      "lib",
      "dummy",
      "resources.json"
    );

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("RESOURCES API ERROR:", error.message);
    return NextResponse.json(
      { error: "Failed to load resources" },
      { status: 500 }
    );
  }
}
