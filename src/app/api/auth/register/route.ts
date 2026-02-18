import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User.model";
import { hashPassword } from "@/lib/auth/hash";
import { signUserToken, COOKIE_NAME } from "@/lib/auth/user-jwt";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, phone, password } = body;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      return NextResponse.json(
        { error: "Phone must be a 10-digit number" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashed = await hashPassword(password);

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: hashed,
    });

    const token = signUserToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    const res = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return res;
  } catch (error: any) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
