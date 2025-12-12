"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.target as HTMLFormElement);
    const email = form.get("email");
    const password = form.get("password");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid login");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("Server error");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 animate-fadeUp relative">

      {/* BACK BUTTON — TOP LEFT OF PAGE */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition"
      >
        <ArrowLeft size={20} />
        Back
      </Link>

      {/* LOGIN CARD */}
      <div className="w-full max-w-md border rounded-xl p-8 shadow-lg bg-card">

        <h1 className="text-3xl font-semibold mb-2 text-center">
          Admin Login
        </h1>

        <p className="text-center text-muted-foreground text-sm mb-6">
          Enter your credentials to access the dashboard.
        </p>

        {error && (
          <p className="text-red-500 text-center mb-4 text-sm animate-fadeIn">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="admin@example.com"
              className="
                w-full mt-1 px-3 py-2 rounded-md border bg-background
                focus:ring-2 focus:ring-primary transition
              "
            />
          </div>

          {/* PASSWORD FIELD WITH SHOW/HIDE */}
          <div className="relative">
            <label className="text-sm font-medium">Password</label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="••••••••"
              className="
                w-full mt-1 px-3 py-2 rounded-md border bg-background
                focus:ring-2 focus:ring-primary transition
              "
            />

            {/* TOGGLE ICON */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-3 text-muted-foreground hover:text-primary transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

      </div>
    </main>
  );
}
