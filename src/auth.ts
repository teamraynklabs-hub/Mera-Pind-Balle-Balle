// src/auth.ts
export const runtime = "nodejs";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import authConfig from "./auth.config"; // import the edge-safe part
import jwt from 'jsonwebtoken';
import { connectDB } from "./lib/db";
import AdminUser from "./lib/models/AdminUser.model";
import { verifyPassword } from "./lib/auth/hash";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig, // merge edge-safe config
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
          console.warn("[AUTH] Missing or invalid credentials");
          return null;
        }

        // First try DB-based admin (preferred)
        try {
          await connectDB();
          const admin = await AdminUser.findOne({ email, isActive: true }).lean();
          if (admin) {
            console.log("[AUTH] Found admin in DB:", email);
            const ok = await verifyPassword(password, (admin as any).password);
            if (ok) {
              console.log("[AUTH] Password verified for DB admin");
              return {
                id: (admin as any)._id.toString(),
                name: (admin as any).name,
                email: (admin as any).email,
                role: (admin as any).role || "admin",
              };
            }
            console.warn("[AUTH] Password verification failed for DB admin:", email);
            return null;
          }
          console.log("[AUTH] No DB admin found with email:", email);
        } catch (err) {
          console.error("[AUTH] DB check failed, falling back to env auth:", err);
        }

        // Fallback to env-based admin (legacy / quick setup)
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
          console.error("[AUTH] Environment admin credentials not configured");
          return null;
        }

        if (email !== adminEmail) {
          console.warn("[AUTH] Email mismatch. Expected:", adminEmail, "Got:", email);
          return null;
        }

        if (password !== adminPassword) {
          console.warn("[AUTH] Password mismatch for env admin");
          return null;
        }

        console.log("[AUTH] Env-based admin authenticated");
        return {
          id: "admin-env",
          name: "Admin",
          email: adminEmail,
          role: "admin",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // ⏱️ 1 hour session timeout for security
  },
  pages: {
    signIn: "/admin-login",
  },
  secret: process.env.AUTH_SECRET,
});

interface DecodedToken {
  userId: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  iat: number;
  exp: number;
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): DecodedToken | null {
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error('[AUTH] Token verification failed:', error);
    return null;
  }
}

/**
 * Generate JWT token (for login)
 */
export function generateToken(
  userId: string,
  email: string,
  role: 'admin' | 'manager' | 'user',
  expiresIn: string = '24h'
): string {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign(
    {
      userId,
      email,
      role
    },
    secret,
    { expiresIn } as jwt.SignOptions
  );
}

export function isTokenValid(token: string): boolean {
  return verifyToken(token) !== null;
}

/**
 * Check if decoded token belongs to an admin user
 */
export function isAdmin(decoded: DecodedToken | null): boolean {
  return decoded !== null && decoded.role === 'admin';
}

