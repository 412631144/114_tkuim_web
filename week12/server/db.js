// server/db.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config(); // 確保讀得到 .env

const url = process.env.MONGO_URI;
const client = new MongoClient(url);

let db = null;

export async function connectDB() {
  try {
    await client.connect();
    console.log('成功連線到 MongoDB');
    db = client.db(); // 使用 URI 中指定的 database (week12)
    return db;
  } catch (err) {
    console.error('MongoDB 連線失敗:', err);
    process.exit(1);
  }
}

export function getCollection(collectionName) {
  if (!db) {
    throw new Error('資料庫尚未連線');
  }
  return db.collection(collectionName);
}