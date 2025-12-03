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
      "careers.json"
    );

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("CAREERS GET ERROR:", error.message);
    return NextResponse.json(
      { error: "Failed to load careers data" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Later: Save to DB
    console.log("NEW CAREER APPLICATION:", body);

    return NextResponse.json({
      message: "Application submitted successfully!",
      data: body
    });
  } catch (error: any) {
    console.error("CAREERS POST ERROR:", error.message);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
