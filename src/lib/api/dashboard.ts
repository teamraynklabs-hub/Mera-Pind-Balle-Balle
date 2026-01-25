import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";

export async function getDashboardData() {
  try {
    const base = getBaseUrl();
    const res = await axios.get(`${base}/api/dashboard`);

    return res.data?.success ? res.data.data : null;
  } catch (error) {
    console.error("DASHBOARD FETCH ERROR:", error);
    return null;
  }
}
