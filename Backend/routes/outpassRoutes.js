// backend/routes/outpassRoutes.js
const express = require("express");
const router  = express.Router();

const {
  applyOutpass,
  getStudentOutpasses,
  getOutpassById,
  getParentOutpasses,
  approveOutpass,
  rejectOutpass,
  verifyWithMedia, uploadMedia,       // ← new
  adminGetAllOutpasses,               // ← new (see step 5)
  adminFinalDecision,
} = require("../controllers/outpassController");

const protect        = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// ── Protected student routes ──────────────────────────────────────────────────
router.post("/apply",       protect, authorizeRoles("student"), applyOutpass);
router.get("/my-passes",    protect, authorizeRoles("student"), getStudentOutpasses);
router.get("/parent-passes",protect, authorizeRoles("parent"),  getParentOutpasses);


router.post("/verify/:id", uploadMedia, verifyWithMedia);



// ── Wildcard — must be last ───────────────────────────────────────────────────
router.get("/:id", protect, authorizeRoles("student"), getOutpassById);

module.exports = router;