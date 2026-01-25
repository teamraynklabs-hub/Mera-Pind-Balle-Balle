import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import AdminUser from "@/lib/models/AdminUser.model";
import { verifyPassword } from "@/lib/auth/hash";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();

        const user = await AdminUser.findOne({
          email: credentials.email,
          isActive: true,
        }).lean();

        if (!user) return null;

        // Cast both passwords to string to satisfy type requirements
        const inputPassword = String(credentials.password);
        const passwordHash = String(user.password);
        const isValid = await verifyPassword(inputPassword, passwordHash);

        if (!isValid) return null;

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