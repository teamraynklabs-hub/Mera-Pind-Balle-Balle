import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// You can move this to .env later
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Email Regex (Professional validation)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Strong Password Validation (min 6 chars, letters + numbers)
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1️⃣ Check required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // 2️⃣ Email validation
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // 3️⃣ Password pattern validation
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 6 characters long and contain both letters and numbers",
        },
        { status: 400 }
      );
    }

    // 4️⃣ Matching Admin Credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { message: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    // 5️⃣ Create JWT Token
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // 6️⃣ Set Cookie (Next.js 14+ async cookies)
    const cookieStore = await cookies();

    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
