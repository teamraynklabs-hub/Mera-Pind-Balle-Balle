import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Later: Save to DB (MongoDB)
    console.log("CONTACT FORM RECEIVED:", body);

    return NextResponse.json({
      message: "Message submitted successfully!",
      data: body,
    });
  } catch (error: any) {
    console.error("CONTACT API ERROR:", error.message);
    return NextResponse.json(
      { error: "Failed to submit message" },
      { status: 500 }
    );
  }
}
