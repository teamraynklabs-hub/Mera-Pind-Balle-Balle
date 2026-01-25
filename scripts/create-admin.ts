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
  console.log("Loaded MONGODB_URI:", process.env.MONGODB_URI); 

  await connectDB();

  const exists = await AdminUser.findOne({ email: "admin@mpbb.com" });

  if (exists) {
    console.log(" Admin already exists");
    process.exit(0);
  }

  await AdminUser.create({
    name: "Super Admin",
    email: "admin@mpbb.com",
    password: await hashPassword("admin123"),
    role: "admin",
  });

  console.log(" Admin created successfully");
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("Admin creation failed:", err);
  process.exit(1);
});
