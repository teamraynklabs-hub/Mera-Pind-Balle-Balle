import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve project root and load .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { connectDB } from "@/lib/db/index.js";
import AdminUser from "@/lib/models/AdminUser.model.js";
import { verifyPassword, hashPassword } from "@/lib/auth/hash.js";

function parseArgs() {
  const args = process.argv.slice(2);
  const out: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const val = args[i + 1];
      out[key] = val;
      i++;
    }
  }
  return out;
}

async function main() {
  const args = parseArgs();
  const email = args.email || process.env.ADMIN_EMAIL;
  const current = args.current || args.currentPassword;
  const next = args.new || args.newPassword;

  if (!email) {
    console.error("Provide --email or set ADMIN_EMAIL in .env.local");
    process.exit(1);
  }
  if (!current) {
    console.error("Provide --current <currentPassword>");
    process.exit(1);
  }
  if (!next) {
    console.error("Provide --new <newPassword>");
    process.exit(1);
  }

  await connectDB();

  const admin = await AdminUser.findOne({ email, isActive: true });
  if (!admin) {
    console.error("Admin not found for email:", email);
    process.exit(2);
  }

  const ok = await verifyPassword(current, (admin as any).password);
  if (!ok) {
    console.error("Current password is incorrect");
    process.exit(3);
  }

  (admin as any).password = await hashPassword(next);
  await admin.save();

  console.log("Admin password updated successfully for", email);
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(10);
});
