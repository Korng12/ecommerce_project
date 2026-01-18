import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/dbConn.js";

dotenv.config();

const app = express();
app.use(express.json());

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");

    app.listen(3000, () => {
      console.log("🚀 Server running on port 3000");
    });
  } catch (err) {
    console.error("❌ DB connection failed", err);
  }
})();
