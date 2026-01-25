"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { auth } from "@/auth";    // commented out — not used here

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
            console.log("✅ Login successful, redirecting...");
            window.location.href = "/admin";
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md p-8 border animate-fadeup rounded-xl shadow-xl"
            >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                    Admin Login
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm text-center">
                    🔐 Secure admin access only
                </p>

                {error && (
                    <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 mb-6 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        placeholder="admin@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-60 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        autoComplete="email"
                    />
                </div>

                <div className="mb-7">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        autoComplete="current-password"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                    Login to Dashboard
                </button>

                <p className="text-xs text-gray-500 dark:text-gray-600 mt-6 text-center">
                    ⚠️ This is a secure admin area. Only authorized personnel should log in.
                </p>
            </form>
        </main>
    );
}