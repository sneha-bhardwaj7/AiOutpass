const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const outpassRoutes = require("./routes/outpassRoutes");

dotenv.config();
connectDB();

const app = express();

// ✅ Simple CORS for local development
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite frontend URL
  credentials: true,
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/outpass", outpassRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "PassWithAI API is running ✅" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);