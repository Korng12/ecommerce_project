import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());               // ✅ REQUIRED
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRoutes);

app.listen(3000, () => {
  console.log('🚀 Server running on port 3000');
});
