// routes/participants.js
import express from 'express';
import { getCollection } from '../db.js';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const router = express.Router();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: '未授權' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; 
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token 無效或過期' });
  }
};

router.get('/', async (req, res) => {
  const list = await getCollection('participants').find().toArray();
  res.json(list);
});

router.post('/', verifyToken, async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: '請輸入姓名與電話' });
  }

  const currentUserId = req.user.sub; 

  const result = await getCollection('participants').insertOne({
    name,
    phone,
    createdBy: currentUserId, 
    createdAt: new Date()
  });

  res.status(201).json({ _id: result.insertedId, name, phone });
});

router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user.sub;
  const currentUserRole = req.user.role; 

  try {
    const collection = getCollection('participants');
    
    const participant = await collection.findOne({ _id: new ObjectId(id) });

    if (!participant) {
      return res.status(404).json({ error: '找不到該資料' });
    }

    const isAdmin = currentUserRole === 'admin';
    const isOwner = participant.createdBy === currentUserId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: '權限不足：你只能刪除自己建立的資料' });
    }
    // --------------------

    await collection.deleteOne({ _id: new ObjectId(id) });
    res.json({ message: '刪除成功' });

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'ID 格式錯誤或系統異常' });
  }
});

export default router;