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
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173", // frontend
      "http://localhost:5000", // backend (if needed)
    ];

    // allow requests with no origin (like Postman / mobile / email links)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
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