require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const productRoutes = require('./routes/api/products');
const categoryRoutes = require('./routes/api/categories');
const brandRoutes = require('./routes/api/brands');
const verifyJwt = require('./middleware/authJwt'); 
const verifyRole = require('./middleware/verifyRoles');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');

const cartRoutes = require("./routes/api/carts");
const orderRoutes = require("./routes/api/orders");
const paymentRoutes = require("./routes/api/payments");

// Serve static files for images
app.use("/images", express.static(path.join(__dirname, "public", "images","categories")));
console.log(
  "📁 Serving static images from:",
  path.join(__dirname, "public", "images"),
);
app.use("/categories", express.static(path.join(__dirname, "uploads")));

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

// ⚠️ IMPORTANT: Webhook route MUST come before express.json()
// because it needs the raw body for signature verification
const webhookRouter = require("./routes/api/payments");
app.use("/api", webhookRouter.webhookOnly);

// Now apply JSON parser for all other routes
app.use(express.json()); // ✅ REQUIRED
app.use(express.urlencoded({ extended: true }));


// user management routes
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes)

// Dashboard routes
const dashboardRoutes = require('./routes/dashboard')
app.use('/api/dashboard', dashboardRoutes)

// Product Routes
const productsRoutes = require('./routes/api/products');
app.use('/api', productsRoutes);

// Serve static files for images
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
// for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('📁 Serving static images from:', path.join(__dirname, 'public', 'images'));

app.use('/api', authRoutes);
app.use('/hello',(req,res)=>{
  console.log(req.url)
  res.status(200).json("Hello")

});

app.use('/protected',verifyJwt,(req,res)=>{
  res.status(200).json({message:"Protected content",user:req.user});
});
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", brandRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api", webhookRouter.apiRoutes);
app.use(
  "/users",
  verifyJwt,
  verifyRole(1),
  require("./controllers/authController").getAllUsers,
);
app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
