// backend/index.js
const dotenv = require("dotenv");
dotenv.config();  // ← MUST be before ANY other require

const express       = require("express");
const cors          = require("cors");
const path          = require("path");
const connectDB     = require("./config/db");
const authRoutes    = require("./routes/authRoutes");
const outpassRoutes = require("./routes/outpassRoutes");
const parentRoutes = require("./routes/parentRoutes");

connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use("/api/auth",    authRoutes);
app.use("/api/outpass", outpassRoutes);
app.use("/uploads",     express.static(path.join(__dirname, "uploads")));
app.use("/api/parents", parentRoutes);

app.get("/", (req, res) => res.json({ message: "PassWithAI API is running " }));
const PORT = process.env.PORT || 5080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));