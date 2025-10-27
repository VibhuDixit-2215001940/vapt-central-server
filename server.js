// server.js

const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const connectDB = require("./src/config/db");
const apiRoutes = require("./src/routes/api");

// LOAD ENVIRONMENT VARIABLES
dotenv.config();

// CONNECT TO DATABASE
connectDB();

const app = express();

// ===================================
// 1. CORE MIDDLEWARES & SETUP
// ===================================

// ENABLE CORS (LIMIT TO SPECIFIC DOMAINS IN PRODUCTION)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "50mb" }));

// SET EJS VIEW ENGINE
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// SERVE STATIC FILES FROM PUBLIC FOLDER
app.use(express.static(path.join(__dirname, "public")));

// ===================================
// 2. ROUTES
// ===================================

// USE ALL API AND UI ROUTES WITH /api/v1 PREFIX
app.use("/api/v1", apiRoutes);

// BASIC HEALTH CHECK ROUTE
app.get("/", (req, res) => {
  res.send(
    "VAPT Central Server API is running successfully. Access Admin UI at /api/v1/admin/login"
  );
});

// ===================================
// 3. SERVER START
// ===================================

// USE HOSTING PLATFORM PORT OR DEFAULT TO 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));