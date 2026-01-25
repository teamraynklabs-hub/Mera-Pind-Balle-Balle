// src/auth.ts
export const runtime = "nodejs";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import authConfig from "./auth.config"; // import the edge-safe part
import { connectDB } from "@/lib/db";
import AdminUser from "@/lib/models/AdminUser.model";
import { verifyPassword } from "@/lib/auth/hash";
import jwt from 'jsonwebtoken';

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
          return null;
        }

        await connectDB();

        const user = await AdminUser.findOne({ email, isActive: true }).lean();

        if (!user) return null;

        const valid = await verifyPassword(password, user.password);
        if (!valid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
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

