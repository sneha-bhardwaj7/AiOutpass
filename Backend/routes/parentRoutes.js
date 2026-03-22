// backend/routes/parentRoutes.js
//
// ── FIX ───────────────────────────────────────────────────────────────────────
//  BUG:  GET /api/parents/list returned ALL parents to every student.
//        So when a student opened the outpass form, they saw every parent
//        registered in the system — not just their own parents.
//
//  FIX:  Filter by the logged-in student's identity.
//        The Parent model stores studentId (the college roll number string).
//        The logged-in student has req.user.studentId (set at signup).
//        We match Parent.studentId === req.user.studentId to return only
//        parents linked to that specific student.
//
//        Fallback: if the student has no studentId set yet, also try matching
//        by name so students who signed up without a roll number still work.
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

// ── Admin gets ALL parents (for the Parents management page) ──────────────────
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

// ── Admin gets ALL registered students ───────────────────────────────────────
// Used by AdminParents dropdown to show every signed-up student.
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

// ── Student fetches ONLY THEIR OWN parents (for outpass form dropdown) ────────
//
// FIX: was → Parent.find()  — returned ALL parents in DB
// NOW  → Parent.find({ studentId: req.user.studentId })
//         returns only parents whose studentId matches the logged-in student
//
// Route: GET /api/parents/list
// Auth:  any logged-in user (student calls this)
router.get("/list", protect, async (req, res) => {
  try {
    const student = req.user; // set by authMiddleware

    // Build filter — match parents linked to this student's roll number
    // studentId on the Parent model = the college roll number string stored
    // when admin added the parent (e.g. "CS2021001")
    const filter = {};

    if (student.studentId) {
      // Primary match: by studentId (college roll number)
      filter.studentId = student.studentId;
    } else if (student.collegeId) {
      // Fallback: some students store roll number in collegeId field
      filter.studentId = student.collegeId;
    } else {
      // Last resort: match by student name (less reliable but better than all)
      filter.studentName = student.name;
    }

    const parents = await Parent.find(filter)
      .select("name email phone relation studentName studentId");

    res.json({ parents });
  } catch (err) {
    console.error("GET /api/parents/list error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;