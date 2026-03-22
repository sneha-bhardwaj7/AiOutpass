// backend/routes/parentRoutes.js
//
// ── FIX: /list now matches parents to the logged-in student ──────────────────
//  The student "sneha" has studentId "23030841" in the User model.
//  The Parent document also has studentId "23030841" (set when admin added it).
//  Filter: Parent.find({ studentId: req.user.studentId })
//
//  Also added OR filter on studentName as fallback for older records where
//  studentId may not have been saved correctly.
// ─────────────────────────────────────────────────────────────────────────────

const express  = require("express");
const router   = express.Router();
const Parent   = require("../models/Parent");
const User     = require("../models/User");
const protect  = require("../middleware/authMiddleware");
const authRole = require("../middleware/roleMiddleware");

// ── Admin adds a parent ───────────────────────────────────────────────────────
router.post("/", protect, authRole("admin"), async (req, res) => {
  try {
    const parent = await Parent.create({ ...req.body, addedBy: req.user._id });
    res.status(201).json({ message: "Parent added", parent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Admin gets ALL parents ────────────────────────────────────────────────────
router.get("/", protect, authRole("admin"), async (req, res) => {
  try {
    const parents = await Parent.find().sort({ createdAt: -1 });
    res.json({ parents });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Admin deletes a parent ────────────────────────────────────────────────────
router.delete("/:id", protect, authRole("admin"), async (req, res) => {
  try {
    await Parent.findByIdAndDelete(req.params.id);
    res.json({ message: "Parent removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Admin: get all registered students for dropdown ───────────────────────────
router.get("/students", protect, authRole("admin"), async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("_id name studentId collegeId hostelRoom email phone department year")
      .sort({ name: 1 });
    res.json({ students });
  } catch (err) {
    console.error("GET /api/parents/students error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── Student: fetch ONLY their own parents ─────────────────────────────────────
// Route: GET /api/parents/list
//
// How matching works:
//   - Student logs in → req.user has { studentId, collegeId, name, _id }
//   - Admin added parent with studentId = the roll number string (e.g. "23030841")
//   - We match Parent.studentId against all possible ID fields on the student
//   - Also match by studentName as fallback for legacy records
//
// NOTE: /list MUST be registered BEFORE /:id to avoid Express treating
//       "list" as a dynamic :id param.
router.get("/list", protect, async (req, res) => {
  try {
    const u = req.user;

    // Collect all possible identifiers this student might have
    const possibleIds   = [u.studentId, u.collegeId].filter(Boolean);
    const possibleNames = [u.name].filter(Boolean);

    console.log(`[/api/parents/list] user: ${u.name}, studentId: ${u.studentId}, collegeId: ${u.collegeId}`);

    let parents = [];

    if (possibleIds.length > 0) {
      // Primary: match by studentId field stored on Parent document
      parents = await Parent.find({
        studentId: { $in: possibleIds },
      }).select("name email phone relation studentName studentId");

      console.log(`[/api/parents/list] matched by ID: ${parents.length}`);
    }

    // Fallback: if nothing found by ID, try matching by name
    if (parents.length === 0 && possibleNames.length > 0) {
      parents = await Parent.find({
        studentName: { $in: possibleNames },
      }).select("name email phone relation studentName studentId");

      console.log(`[/api/parents/list] matched by name: ${parents.length}`);
    }

    res.json({ parents });
  } catch (err) {
    console.error("GET /api/parents/list error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;