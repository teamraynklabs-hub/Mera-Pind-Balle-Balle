"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

interface UserAuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  requireAuth: (redirectBack?: string) => boolean;
}

const UserAuthContext = createContext<UserAuthContextType | null>(null);

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };
      setUser(data.user);
      return { success: true };
    } catch {
      return { success: false, error: "Login failed" };
    }
  }, []);

  const signup = useCallback(async (body: { name: string; email: string; phone: string; password: string }) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };
      setUser(data.user);
      return { success: true };
    } catch {
      return { success: false, error: "Signup failed" };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/user-logout", { method: "POST" });
    } catch {
      // ignore
    }
    setUser(null);
    router.push("/");
  }, [router]);

  const requireAuth = useCallback(
    (redirectBack?: string) => {
      if (loading) return false;
      if (!user) {
        const redirect = redirectBack || pathname;
        router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
        return false;
      }
      return true;
    },
    [user, loading, router, pathname]
  );

  const value = useMemo(
    () => ({ user, loading, login, signup, logout, refreshUser, requireAuth }),
    [user, loading, login, signup, logout, refreshUser, requireAuth]
  );

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("useUserAuth must be used within a UserAuthProvider");
  }
  return context;
}
