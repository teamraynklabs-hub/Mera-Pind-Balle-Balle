"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Just try to access admin page - if already logged in, middleware will allow
            } catch (err) {
                // Ignore errors, just let the page load normally
            }
        };
        checkAuth();
    }, [router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (!res?.ok) {
            setError("Invalid email or password. Please try again.");
            setPassword("");
        } else {
            window.location.href = "/admin";
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md p-8 border animate-fadeup rounded-xl shadow-xl bg-card"
            >
                <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
                    Admin Login
                </h1>
                <p className="text-muted-foreground mb-8 text-sm text-center">
                    Secure admin access only
                </p>

                {error && (
                    <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 mb-6 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="mb-5">
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        placeholder="admin@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                        autoComplete="email"
                    />
                </div>

                <div className="mb-7">
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                        autoComplete="current-password"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                >
                    Login to Dashboard
                </button>

                <p className="text-xs text-muted-foreground mt-6 text-center">
                    This is a secure admin area. Only authorized personnel should log in.
                </p>
            </form>
        </main>
    );
}
