import 'dotenv/config';
import bcrypt from 'bcrypt';
import { connectDB } from '../db.js';

const email = process.argv[2];
const password = process.argv[3];
const role = process.argv[4] || "student";

if (!email || !password) {
  console.log("使用方式: node scripts/create_user.js <email> <password> [role]");
  process.exit(1);
}

const run = async () => {
  const db = await connectDB();
  const passwordHash = await bcrypt.hash(password, 10);

  const result = await db.collection('users').insertOne({
    email,
    passwordHash,
    role,
    createdAt: new Date()
  });

  console.log("建立成功，_id:", result.insertedId);
  process.exit(0);
};

run();