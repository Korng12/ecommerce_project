
require('dotenv').config()
const express=require('express')
const app = express();
const cors=require('cors')
app.use(cors());
app.use(express.json());               // ✅ REQUIRED
app.use(express.urlencoded({ extended: true }));
const authRoutes = require('./routes/authRoutes')
app.use('/api', authRoutes);
app.use('/hello',(req,res)=>{
  console.log(req.url)
  res.status(200).json("Hello")
});
app.listen(3000, () => {
  console.log('🚀 Server running on port 3000');
});
