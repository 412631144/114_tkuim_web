import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../repositories/users.js';

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log(' 1. [Login Request] Email:', email);
    console.log('1. [Login Request] Password:', password); // 注意：僅測試用，正式上線請移除

    if (!email || !password) {
      return res.status(400).json({ error: '請提供 email 與 password' });
    }

    const user = await findUserByEmail(email);

    console.log(' 2. [DB Find] User object:', user);

    if (!user) {
      console.log(' [Error] 找不到此使用者');
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    console.log('👉 3. [Hash Check] DB Hash:', user.passwordHash); 

    const ok = await bcrypt.compare(password, user.passwordHash);

    console.log(' 4. [Bcrypt] Match result:', ok);

    if (!ok) {
      console.log('[Error] 密碼比對失敗');
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    const token = jwt.sign(
      {
        sub: user._id.toString(),
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    console.log(' [Success] 登入成功，發送 Token');

    res.json({
      token,
      user: {
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(' [Exception] 發生錯誤:', error);
    next(error);
  }
});

export default router;