
require('dotenv').config()
const express=require('express')
const app = express();
const cors=require('cors')
const verifyJwt = require('./middleware/authJwt'); 
const verifyRole = require('./middleware/verifyRoles');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());               // ✅ REQUIRED
app.use(express.urlencoded({ extended: true }));
const authRoutes = require('./routes/authRoutes')
app.use('/api', authRoutes);
app.use('/hello',(req,res)=>{
  console.log(req.url)
  res.status(200).json("Hello")
});

app.use('/protected',verifyJwt,(req,res)=>{
  res.status(200).json({message:"Protected content",user:req.user});
});
app.use('/users',verifyJwt,verifyRole(5),require('./controllers/authController').getAllUsers);
app.listen(3000, () => {
  console.log('🚀 Server running on port 3000');
});
