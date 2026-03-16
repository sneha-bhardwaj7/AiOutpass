const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true },
  phone:        { type: String, required: true },
  relation:     { type: String, required: true }, // Father / Mother / Guardian
  studentName:  { type: String },
  studentId:    { type: String },
  addedBy:      { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin
}, { timestamps: true });

module.exports = mongoose.model("Parent", parentSchema);