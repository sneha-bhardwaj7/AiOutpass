const express = require("express");
const multer = require("multer");  // ← ADD THIS
const {
  studentSignup,
  parentSignup,
  adminSignup,
  loginUser,
  getProfile,
  updateAdminProfile,
  changeAdminPassword,
  updateStudentProfile,
  changeStudentPassword      
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

const upload = multer({ dest: "uploads/" });  // ← ADD THIS

const router = express.Router();

// STUDENT
router.post("/student/signup", studentSignup);
router.post("/student/login", loginUser);
// PARENT
router.post("/parent/signup", parentSignup);
router.post("/parent/login", loginUser);
// ADMIN
router.post("/admin/signup", adminSignup);
router.post("/admin/login", loginUser);
// PROFILE
router.get("/profile", protect, getProfile);
// ADMIN PROFILE UPDATE
router.put("/admin/profile", protect, upload.single("avatar"), updateAdminProfile);
router.put("/admin/change-password", protect, changeAdminPassword);

// Add these routes:
router.put("/student/profile", protect, upload.single("avatar"), updateStudentProfile);
router.put("/student/change-password", protect, changeStudentPassword);

module.exports = router;