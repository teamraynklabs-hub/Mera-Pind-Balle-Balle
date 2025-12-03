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
      "blogs.json"
    );

    const raw = fs.readFileSync(jsonPath, "utf8");
    return NextResponse.json(JSON.parse(raw));
  } catch (err: any) {
    console.error("BLOG API ERROR:", err.message);
    return NextResponse.json({ error: "Failed to load blogs" }, { status: 500 });
  }
}
