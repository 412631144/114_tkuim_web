import 'dotenv/config';            
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI 未設定，請確認 .env 檔案內容');
}

const client = new MongoClient(uri);
let db;

export async function connectDB() {
  if (db) return db;
  await client.connect();
  db = client.db(); 
  console.log('[DB] Connected to MongoDB (week12)');
  return db;
}

export function getCollection(name) {
  if (!db) {
    throw new Error('Database not initialized, 請先呼叫 connectDB()');
  }
  return db.collection(name);
}

process.on('SIGINT', async () => {
  await client.close();
  console.log('\n[DB] Connection closed');
  process.exit(0);
});