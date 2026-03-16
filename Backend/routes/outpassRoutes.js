const express        = require("express");
const router         = express.Router();
const {
  applyOutpass,
  getStudentOutpasses,
  getOutpassById,
  getParentOutpasses,
  verifyWithMedia,
  uploadMedia,
  adminGetAllOutpasses,
  adminFinalDecision,
} = require("../controllers/outpassController");
const protect        = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Student
router.post("/apply",         protect, authorizeRoles("student"), applyOutpass);
router.get("/my-passes",      protect, authorizeRoles("student"), getStudentOutpasses);

// Parent
router.get("/parent-passes",  protect, authorizeRoles("parent"),  getParentOutpasses);

// Parent verify — PUBLIC (no protect), uses multer uploadMedia
router.post("/verify/:id",    uploadMedia, verifyWithMedia);

// Admin
router.get("/admin/all",           protect, authorizeRoles("admin"), adminGetAllOutpasses);
router.patch("/admin/decision/:id",protect, authorizeRoles("admin"), adminFinalDecision);

// Wildcard — MUST stay last
router.get("/:id",            protect, authorizeRoles("student"), getOutpassById);

module.exports = router;