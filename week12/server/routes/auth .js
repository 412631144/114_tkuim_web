// server/routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import { findUserByEmail, createUser } from '../repositories/users.js';
import { generateToken } from '../utils/generateToken.js';

const router = express.Router();

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. 找使用者
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    // 2. 比對密碼 (資料庫存的是 Hash)
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    // 3. 簽發 Token
    const token = generateToken(user);

    // 4. 回傳資訊 (不回傳密碼 Hash)
    const { passwordHash, ...userInfo } = user;
    res.json({ 
      token, 
      expiresIn: '2h', 
      user: userInfo 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '登入過程發生錯誤' });
  }
});

// POST /auth/signup (註冊新使用者)
router.post('/signup', async (req, res) => {
  try {
    const { email, password, role } = req.body; // role 實際上應該要在後端限制，這裡為了 Lab 方便

    if (await findUserByEmail(email)) {
      return res.status(409).json({ error: '此 Email 已被註冊' });
    }

    // 密碼雜湊
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      email,
      passwordHash,
      role: role || 'student' // 預設為 student
    });

    const token = generateToken(newUser);
    const { passwordHash: _, ...userInfo } = newUser;

    res.status(201).json({ token, user: userInfo });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '註冊失敗' });
  }
});

export default router;