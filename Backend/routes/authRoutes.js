// backend/routes/authRoutes.js
//
// ── FIX: Added GET /students route so AdminParents can list ALL registered
//         students (not just ones who submitted an outpass).
// ─────────────────────────────────────────────────────────────────────────────

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
  getAllStudents,           // ← NEW
} = require("../controllers/authController");
const protect        = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

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

// ── NEW: Admin fetches ALL registered students ────────────────────────────────
// Used by AdminParents page to populate the student selector dropdown.
// Returns every User with role="student" — no outpass required.
router.get(
  "/students",
  protect,
  authorizeRoles("admin"),
  getAllStudents
);

// ── Student profile / password ────────────────────────────────────────────────
router.put("/student/profile",         protect, upload.single("avatar"), updateStudentProfile);
router.put("/student/change-password", protect, changeStudentPassword);

// ── Admin profile / password ──────────────────────────────────────────────────
router.put("/admin/profile",         protect, upload.single("avatar"), updateAdminProfile);
router.put("/admin/change-password", protect, changeAdminPassword);

module.exports = router;