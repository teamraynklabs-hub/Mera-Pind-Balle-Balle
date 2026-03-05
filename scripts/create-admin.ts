import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve absolute path to project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env.local"),
});

import { connectDB } from "../src/lib/db";
import AdminUser from "../src/lib/models/AdminUser.model";
import { hashPassword } from "../src/lib/auth/hash";

async function createAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@mpbb.com";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error(" Error: ADMIN_PASSWORD not set in .env.local");
    process.exit(1);
  }

  console.log("Loaded MONGODB_URI:", process.env.MONGODB_URI);
  console.log("Creating admin with email:", adminEmail);

  await connectDB();

  const exists = await AdminUser.findOne({ email: adminEmail });

  if (exists) {
    console.log(" Admin already exists with email:", adminEmail);
    process.exit(0);
  }

  await AdminUser.create({
    name: "Super Admin",
    email: adminEmail,
    password: await hashPassword(adminPassword),
    role: "admin",
  });

  console.log(" Admin created successfully");
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("Admin creation failed:", err);
  process.exit(1);
});
