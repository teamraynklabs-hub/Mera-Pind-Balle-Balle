#!/usr/bin/env node
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = args[i + 1];
      if (!next || next.startsWith('--')) {
        out[key] = 'true';
      } else {
        out[key] = next;
        i++;
      }
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
    console.error('Provide --email or set ADMIN_EMAIL in .env.local');
    process.exit(1);
  }
  if (!current) {
    console.error('Provide --current <currentPassword>');
    process.exit(1);
  }
  if (!next) {
    console.error('Provide --new <newPassword>');
    process.exit(1);
  }

  const force = args.force === 'true';

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI is not set in .env.local');
    process.exit(1);
  }

  await mongoose.connect(mongoUri, { dbName: process.env.MONGODB_DB || undefined });

  const Schema = mongoose.Schema;
  const AdminUserSchema = new Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: String,
    isActive: { type: Boolean, default: true },
  }, { timestamps: true });

  const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);

  const admin = await AdminUser.findOne({ email, isActive: true });
  if (!admin) {
    console.error('Admin not found for email:', email);
    process.exit(2);
  }

  if (!force) {
    const ok = await bcrypt.compare(current, admin.password);
    if (!ok) {
      console.error('Current password is incorrect');
      process.exit(3);
    }
  } else {
    console.log('Force flag provided: skipping current password verification');
  }

  admin.password = await bcrypt.hash(next, 10);
  await admin.save();

  console.log('Admin password updated successfully for', email);
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(10);
});
