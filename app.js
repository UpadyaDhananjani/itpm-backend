const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const app = express();
const DEFAULT_PORT = process.env.PORT || 5001;

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
const menuRouter = require('./Routes/MenuRoutes');
app.use('/api/menus', menuRouter);

// Connect to MongoDB
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://admin:Upadya*25@cluster0.gleae.mongodb.net/";
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

app.listen(DEFAULT_PORT, () => {
  console.log(`🚀 Server running on port ${DEFAULT_PORT}`);
});
