import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const COOKIE_NAME = "mpbb-user-token";

export interface UserPayload {
  userId: string;
  email: string;
  name: string;
}

export function signUserToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" } as jwt.SignOptions);
}

export function verifyUserToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch {
    return null;
  }
}

export async function getUserFromCookie(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyUserToken(token);
}

export { COOKIE_NAME };
