// backend/routes/parentRoutes.js
//
// ── PERMANENT FIX ─────────────────────────────────────────────────────────────
//  Root cause: parents were linked to students by a string studentId field.
//  If studentId was empty, mistyped, or not set at signup → no match → 0 parents.
//
//  Fix: now saves studentUserId (MongoDB ObjectId) when admin adds a parent.
//  /list matches by req.user._id === parent.studentUserId (always reliable).
//  Fallback to string studentId and name for legacy records.
// ─────────────────────────────────────────────────────────────────────────────

const express  = require("express");
const router   = express.Router();
const Parent   = require("../models/Parent");
const User     = require("../models/User");
const protect  = require("../middleware/authMiddleware");
const authRole = require("../middleware/roleMiddleware");

// ── Admin adds a parent ───────────────────────────────────────────────────────
// Now saves studentUserId from req.body.studentUserId (sent by AdminParents.jsx)
router.post("/", protect, authRole("admin"), async (req, res) => {
  try {
    const {
      name, email, phone, relation,
      studentName, studentId,
      studentUserId,   // ← NEW: MongoDB _id of the student User
    } = req.body;

    const parent = await Parent.create({
      name, email, phone, relation,
      studentName, studentId,
      studentUserId: studentUserId || null,
      addedBy: req.user._id,
    });
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

// ── Admin: all registered students ───────────────────────────────────────────
router.get("/students", protect, authRole("admin"), async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("_id name studentId collegeId hostelRoom email phone department year")
      .sort({ name: 1 });
    res.json({ students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── No-auth debug (remove after confirming fix) ───────────────────────────────
router.get("/open-debug", async (req, res) => {
  try {
    const allParents  = await Parent.find().lean();
    const allStudents = await User.find({ role: "student" })
      .select("_id name studentId collegeId email").lean();
    res.json({ students: allStudents, parents: allParents });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Student: ONLY their own parents ──────────────────────────────────────────
// /list MUST stay before /:id
router.get("/list", protect, async (req, res) => {
  try {
    const u = req.user;

    const allParents = await Parent.find()
      .select("name email phone relation studentName studentId studentUserId")
      .lean();

    const myParents = allParents.filter(p => {
      // PRIMARY: match by MongoDB ObjectId (most reliable)
      if (p.studentUserId && String(p.studentUserId) === String(u._id)) {
        return true;
      }

      // FALLBACK 1: match by studentId string (case-insensitive)
      const pId    = String(p.studentId   || "").trim().toLowerCase();
      const uId1   = String(u.studentId   || "").trim().toLowerCase();
      const uId2   = String(u.collegeId   || "").trim().toLowerCase();
      if (pId && (pId === uId1 || pId === uId2)) {
        return true;
      }

      // FALLBACK 2: match by student name (case-insensitive)
      const pName = String(p.studentName || "").trim().toLowerCase();
      const uName = String(u.name        || "").trim().toLowerCase();
      if (pName && uName && pName === uName) {
        return true;
      }

      return false;
    });

    console.log(`[/list] student="${u.name}" _id="${u._id}" → ${myParents.length} parents matched`);

    res.json({ parents: myParents });
  } catch (err) {
    console.error("GET /api/parents/list error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;