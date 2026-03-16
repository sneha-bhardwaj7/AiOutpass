const express  = require("express");
const router   = express.Router();
const Parent   = require("../models/Parent");
const protect  = require("../middleware/authMiddleware");
const authRole = require("../middleware/roleMiddleware");

// Admin adds a parent
router.post("/", protect, authRole("admin"), async (req, res) => {
  try {
    const parent = await Parent.create({ ...req.body, addedBy: req.user._id });
    res.status(201).json({ message: "Parent added", parent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin gets all parents
router.get("/", protect, authRole("admin"), async (req, res) => {
  try {
    const parents = await Parent.find().sort({ createdAt: -1 });
    res.json({ parents });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin deletes a parent
router.delete("/:id", protect, authRole("admin"), async (req, res) => {
  try {
    await Parent.findByIdAndDelete(req.params.id);
    res.json({ message: "Parent removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Student fetches parents (to pick from dropdown)
router.get("/list", protect, async (req, res) => {
  try {
    const parents = await Parent.find().select("name email phone relation studentName studentId");
    res.json({ parents });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;