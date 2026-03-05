import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { connectDB } from "../db";
import AdminUser from "../models/AdminUser.model";
import { verifyPassword } from "../auth/hash";

export const authConfig = {
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
          if (typeof email !== "string" || typeof password !== "string" || !email || !password) return null;

          // Try DB admin first
          try {
            await connectDB();
            const admin = await AdminUser.findOne({ email: email, isActive: true }).lean();
            if (admin) {
              const ok = await verifyPassword(password, (admin as any).password);
              if (ok) {
                return {
                  id: (admin as any)._id.toString(),
                  name: (admin as any).name,
                  email: (admin as any).email,
                  role: (admin as any).role || "admin",
                };
              }
              return null;
            }
          } catch (err) {
            console.error("[AUTH] DB check failed, falling back to env auth", err);
          }

          // Fallback to env-based admin
          const adminEmail = process.env.ADMIN_EMAIL;
          const adminPassword = process.env.ADMIN_PASSWORD;

          if (!adminEmail || !adminPassword) {
            console.error("[AUTH] ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables");
            return null;
          }

          if (email !== adminEmail || password !== adminPassword) {
            return null;
          }

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
  },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/admin-login",
  },

  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);