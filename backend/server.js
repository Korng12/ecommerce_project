require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const cartRoutes = require("./routes/api/carts");
const orderRoutes = require("./routes/api/orders");
const paymentRoutes = require("./routes/api/payments");
const analyticsRoutes = require("./routes/api/analytics");
const verifyJwt = require("./middleware/authJwt");
const verifyRole = require("./middleware/verifyRoles");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require('./routes/users');
const webhookRouter = require("./routes/api/payments");
const dashboardRoutes = require('./routes/dashboard')
const productsRoutes = require('./routes/api/products');
const categoriesRoutes = require('./routes/api/categories');
const brandsRoutes = require('./routes/api/brands');
const reviewRoutes = require('./routes/reviewRoutes');
const profileRoutes = require('./routes/profileRoutes')
const statisticsRoutes = require('./routes/statisticsRoutes')
// Serve static files for images
app.use("/categories", express.static(path.join(__dirname, "public", "images","categories")));
app.use("/images/products", express.static(path.join(__dirname, "public", "images","products")));

app.use("/uploads/categories", express.static(path.join(__dirname, "uploads","categories")));

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

// ⚠️ IMPORTANT: Webhook route MUST come before express.json()
// because it needs the raw body for signature verification
app.use("/api", webhookRouter.webhookOnly);

// Now apply JSON parser for all other routes
app.use(express.json()); // ✅ REQUIRED
app.use(express.urlencoded({ extended: true }));


// user management routes
app.use('/api/users', userRoutes)

// Dashboard routes
app.use('/api/dashboard', dashboardRoutes)

app.use('/api', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/hello',(req,res)=>{
  console.log(req.url)
  res.status(200).json("Hello")
});

app.use('/protected',verifyJwt,(req,res)=>{
  res.status(200).json({message:"Protected content",user:req.user});
});
app.use("/api", productsRoutes);
app.use("/api", categoriesRoutes);
app.use("/api", brandsRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api", webhookRouter.apiRoutes); // Payment routes BEFORE analytics
app.use("/api", analyticsRoutes);
app.use(
  "/users",
  verifyJwt,
  verifyRole(1),
  require("./controllers/authController").getAllUsers,
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('ERROR:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
