import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "src/lib/dummy/stories.json");
    const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return NextResponse.json(json);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
