// server/routes/signup.js
import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
// 假設你有這些 Repository 方法
import { 
  findAll, 
  findByOwner, 
  createParticipant, 
  deleteParticipant, 
  findById 
} from '../repositories/participants.js'; 

const router = express.Router();

// 1. 全部路由啟用 JWT 驗證
router.use(authMiddleware);

// GET /api/signup (查詢)
router.get('/', async (req, res) => {
  try {
    let data;
    // Admin 看全部，一般使用者只看自己的
    if (req.user.role === 'admin') {
      data = await findAll();
    } else {
      data = await findByOwner(req.user.id);
    }
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: '讀取資料失敗' });
  }
});

// POST /api/signup (新增)
router.post('/', async (req, res) => {
  try {
    // 強制加上 ownerId 為目前登入者
    const newParticipant = {
      ...req.body,
      ownerId: req.user.id, 
      createdAt: new Date()
    };
    
    const result = await createParticipant(newParticipant);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: '新增失敗' });
  }
});

// DELETE /api/signup/:id (刪除)
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const item = await findById(id);

    if (!item) {
      return res.status(404).json({ error: '找不到該筆資料' });
    }

    // 權限檢查：只有 Admin 或 資料擁有者 可以刪除
    if (req.user.role !== 'admin' && item.ownerId !== req.user.id) {
      return res.status(403).json({ error: '權限不足，無法刪除他人資料' });
    }

    await deleteParticipant(id);
    res.json({ message: '刪除完成' });

  } catch (err) {
    res.status(500).json({ error: '刪除失敗' });
  }
});

export default router;