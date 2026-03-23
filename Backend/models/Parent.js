// backend/models/Parent.js
//
// ── FIX: Added studentUserId field ───────────────────────────────────────────
//  Previously parents were linked to students only by a STRING studentId
//  (e.g. "23030841"). If that string was empty or mismatched, no parents
//  showed up for the student.
//
//  NEW: studentUserId stores the actual MongoDB ObjectId of the student's
//  User document. This is 100% reliable — ObjectIds never mismatch.
//
//  The /list route now matches by studentUserId (primary) OR
//  studentId string / studentName (fallback for existing records).
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true },
  phone:        { type: String, required: true },
  relation:     { type: String, required: true },
  studentName:  { type: String },
  studentId:    { type: String },

  // ← NEW: reliable link to the student's User document
  studentUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  "User",
    default: null,
  },

  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Parent", parentSchema);