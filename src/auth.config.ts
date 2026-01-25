// src/auth.config.ts  (edge-compatible – NO bcrypt, NO db queries here)
import type { NextAuthConfig } from "next-auth";

export default {
    pages: {
        signIn: "/admin-login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");

            if (isOnAdmin) {
                if (isLoggedIn) return true;
                return false; // Redirect to login (middleware will handle)
            }
            return true;
        },
        jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    providers: []
} satisfies NextAuthConfig;