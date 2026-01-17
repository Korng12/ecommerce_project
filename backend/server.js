
require('dotenv').config()
const express=require('express')
const app = express();
const cors=require('cors')
const path=require('path')

app.use(cors());
app.use(express.json());               // ✅ REQUIRED
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/api/productRoutes');
const e = require('express');

app.use('/api', productRoutes);
app.use('/api', authRoutes);

app.get('/health',(req,res)=>{
  res.status(200).json({
    status:"OK",
    message: 'Ecommerce API is running',
  });
});

app.use('/hello',(req,res)=>{
  console.log(req.url)
  res.status(200).json("Hello")
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📚 Test these endpoints:`);
  console.log(`- GET http://localhost:${PORT}/health`);
  console.log(`- GET http://localhost:${PORT}/api/products`);
  console.log(`- POST http://localhost:${PORT}/api/categories`);
  console.log(`- POST http://localhost:${PORT}/api/brands`);

  
});
