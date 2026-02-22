import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
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

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
          console.error("[AUTH] ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables");
          return null;
        }

        if (credentials.email !== adminEmail || credentials.password !== adminPassword) {
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