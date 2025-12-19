import { ObjectId } from 'mongodb';
import { getCollection } from '../db.js';

const col = () => getCollection('participants');

export async function createParticipant({ name, phone, ownerId }) {
  const doc = {
    name,
    phone,
    ownerId: new ObjectId(ownerId),
    createdAt: new Date()
  };
  const result = await col().insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function listParticipantsByOwner(ownerId) {
  return col()
    .find({ ownerId: new ObjectId(ownerId) })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function listAllParticipants() {
  return col().find().sort({ createdAt: -1 }).toArray();
}

export async function findParticipantById(id) {
  return col().findOne({ _id: new ObjectId(id) });
}

export async function deleteParticipantById(id) {
  return col().deleteOne({ _id: new ObjectId(id) });
}