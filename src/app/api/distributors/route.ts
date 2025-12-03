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
      "distributors.json"
    );

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("DISTRIBUTOR GET ERROR:", error.message);
    return NextResponse.json({ error: "Failed to load distributor info" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Here you can save to database later
    console.log("NEW DISTRIBUTOR REQUEST:", body);

    return NextResponse.json({
      message: "Distributor request submitted successfully!",
      data: body
    });
  } catch (error: any) {
    console.error("DISTRIBUTOR POST ERROR:", error.message);
    return NextResponse.json({ error: "Failed to submit distributor request" }, { status: 500 });
  }
}
