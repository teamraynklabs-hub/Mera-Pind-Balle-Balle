import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Contact from "@/lib/models/Contact.model";
import { ContactFormSchema } from "@/lib/validations/contact";
import { handleApiError, createSuccessResponse } from "@/lib/api-error";
import { getRequestId } from "@/lib/request-id";

export async function POST(req: Request) {
  const requestId = await getRequestId();

  try {
    console.log(`[${requestId}] Processing contact form submission`);

    const body = await req.json();

    // Validate using Zod
    const validated = ContactFormSchema.parse(body);

    // Sanitize inputs
    const sanitized = {
      name: validated.name.trim(),
      email: validated.email.toLowerCase().trim(),
      phone: validated.phone?.trim() || null,
      message: validated.message.trim(),
    };

    await connectDB();

    const contact = await Contact.create(sanitized);

    console.log(`[${requestId}] Contact message saved with ID: ${contact._id}`);

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully. We'll get back to you soon!",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn(`[${requestId}] Validation error:`, error.issues);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input data",
          code: "VALIDATION_ERROR",
          details: error.issues.map((e) => ({
            path: e.path.join(""),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    return handleApiError(error, requestId);
  }
}
