// backend/routes/authRoutes.js
const express = require("express");
const multer  = require("multer");
const {
  studentSignup,
  parentSignup,
  adminSignup,
  loginUser,
  getProfile,
  updateAdminProfile,
  changeAdminPassword,
  updateStudentProfile,
  changeStudentPassword,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// ── Use memoryStorage so the file.buffer is available for Cloudinary
//    (no files are written to disk)
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post("/student/signup", studentSignup);
router.post("/student/login",  loginUser);
router.post("/parent/signup",  parentSignup);
router.post("/parent/login",   loginUser);
router.post("/admin/signup",   adminSignup);
router.post("/admin/login",    loginUser);

// ── Profile ───────────────────────────────────────────────────────────────────
router.get("/profile", protect, getProfile);

// ── Student profile / password ────────────────────────────────────────────────
router.put("/student/profile",         protect, upload.single("avatar"), updateStudentProfile);
router.put("/student/change-password", protect, changeStudentPassword);

// ── Admin profile / password ──────────────────────────────────────────────────
router.put("/admin/profile",         protect, upload.single("avatar"), updateAdminProfile);
router.put("/admin/change-password", protect, changeAdminPassword);

module.exports = router;