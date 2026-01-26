import { headers } from "next/headers";
import { randomUUID } from "crypto";

export async function getRequestId(): Promise<string> {
  const h = await headers();
  return h.get("x-request-id") || randomUUID();
}
