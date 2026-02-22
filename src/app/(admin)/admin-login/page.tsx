"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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

    function validateEmail(value: string): string {
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Please enter a valid email address";
        return "";
    }

    function validatePassword(value: string): string {
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
    }

    function handleEmailChange(value: string) {
        setEmail(value);
        if (emailError) setEmailError(validateEmail(value));
        if (error) setError("");
    }

    function handlePasswordChange(value: string) {
        setPassword(value);
        if (passwordError) setPasswordError(validatePassword(value));
        if (error) setError("");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const eErr = validateEmail(email);
        const pErr = validatePassword(password);
        setEmailError(eErr);
        setPasswordError(pErr);

        if (eErr || pErr) return;

        setError("");
        setIsLoading(true);

        try {
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
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md p-8 border animate-fadeup rounded-xl shadow-xl bg-card"
                noValidate
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
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        onBlur={() => setEmailError(validateEmail(email))}
                        className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition ${
                            emailError
                                ? "border-destructive focus:ring-destructive/50"
                                : "border-input focus:ring-ring"
                        }`}
                        autoComplete="email"
                        disabled={isLoading}
                    />
                    {emailError && (
                        <p className="text-destructive text-xs mt-1.5">{emailError}</p>
                    )}
                </div>

                <div className="mb-7">
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            onBlur={() => setPasswordError(validatePassword(password))}
                            className={`w-full px-4 py-3 pr-12 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition ${
                                passwordError
                                    ? "border-destructive focus:ring-destructive/50"
                                    : "border-input focus:ring-ring"
                            }`}
                            autoComplete="current-password"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                            tabIndex={-1}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {passwordError && (
                        <p className="text-destructive text-xs mt-1.5">{passwordError}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg
                                className="animate-spin h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Logging in...
                        </span>
                    ) : (
                        "Login to Dashboard"
                    )}
                </button>

                <p className="text-xs text-muted-foreground mt-6 text-center">
                    This is a secure admin area. Only authorized personnel should log in.
                </p>
            </form>
        </main>
    );
}
