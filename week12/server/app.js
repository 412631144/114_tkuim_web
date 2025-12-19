import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import authRouter from './routes/auth.js';
import participantsRouter from './routes/participants.js';

const app = express();

app.use(cors()); 
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/participants', participantsRouter); 

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(500).json({ error: 'Server Error' });
});

const port = process.env.PORT || 3002;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Week12 server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect MongoDB', err);
    process.exit(1);
  });