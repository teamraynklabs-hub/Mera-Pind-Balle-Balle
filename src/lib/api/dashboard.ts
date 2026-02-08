import { getBaseUrl } from "@/lib/getBaseUrl";

export async function getDashboardData() {
  try {
    const base = getBaseUrl();
    const res = await fetch("/api/dashboard", {
      cache: "no-store",
    });



    if (!res.ok) {
      console.error("Dashboard fetch failed with status:", res.status);
      return null;
    }

    const data = await res.json();
    return data?.success ? data.data : null;
  } catch (error) {
    console.error("DASHBOARD FETCH ERROR:", error);
    return null;
  }
}
