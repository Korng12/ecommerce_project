
require('dotenv').config()
const express=require('express')
const app = express();
const cors=require('cors')
app.use(cors());
app.use(express.json());               // ✅ REQUIRED
app.use(express.urlencoded({ extended: true }));
const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')
const statisticsRoutes = require('./routes/statisticsRoutes')
app.use('/api', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/hello',(req,res)=>{
  console.log(req.url)
  res.status(200).json("Hello")
});
app.listen(3000, () => {
  console.log('🚀 Server running on port 3000');
});
