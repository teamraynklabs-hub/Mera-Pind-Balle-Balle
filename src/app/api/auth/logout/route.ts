import { signOut } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * ✅ SECURE LOGOUT ENDPOINT
 * Properly destroys the session and clears cookies
 */
export async function POST(request: NextRequest) {
  try {
    // Destroy the session
    await signOut({ redirect: false });

    // Create response with cleared cookies
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Clear NextAuth cookies explicitly
    response.cookies.set("next-auth.session-token", "", {
      maxAge: 0,
      path: "/",
    });
    response.cookies.set("next-auth.csrf-token", "", {
      maxAge: 0,
      path: "/",
    });
    response.cookies.set("next-auth.callback-url", "", {
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}
