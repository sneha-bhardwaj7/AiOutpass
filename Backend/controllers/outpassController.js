// backend/controllers/outpassController.js
const Outpass = require("../models/Outpass");
const User    = require("../models/User");
const axios   = require("axios");
const multer = require("multer");
const path   = require("path");
const fs     = require("fs");


const N8N_WEBHOOK = process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/outpass-request";
const BASE_URL    = process.env.BASE_URL         || "http://localhost:5000";

// Multer storage config — save to /uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.includes("video") ? ".webm" : ".jpg";
    cb(null, `${file.fieldname}-${req.params.id}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// Controller: parent submits photo + video after clicking approve/reject link
exports.verifyWithMedia = async (req, res) => {
  try {
    const outpass = await Outpass.findById(req.params.id);
    if (!outpass) return res.status(404).json({ message: "Not found" });
    if (outpass.status !== "pending")
      return res.status(400).json({ message: "Already processed" });

    const { decision } = req.body; // "approved" or "rejected"
    const photo = req.files?.photo?.[0];
    const video = req.files?.video?.[0];

    if (!decision || !photo || !video)
      return res.status(400).json({ message: "Photo, video and decision are required" });

    await Outpass.findByIdAndUpdate(req.params.id, {
      parentDecision:  decision,
      parentPhotoPath: photo.path,
      parentVideoPath: video.path,
      verifiedAt:      new Date(),
      status:          "pending-admin",  // Waiting for admin final call
    });

    return res.json({ message: "Verification submitted. Awaiting admin review." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Export the multer middleware too
exports.uploadMedia = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

// ── Apply for outpass ─────────────────────────────────────────────────────────
exports.applyOutpass = async (req, res) => {
  try {
    const {
      studentName, studentId, hostelRoom,
      destination, reason,
      leaveDateFrom, leaveDateTo,
      timeFrom, timeTo,
      parentRelation, parentContact, parentEmail,
    } = req.body;

    const missing = [];
    if (!studentName)    missing.push("studentName");
    if (!studentId)      missing.push("studentId");
    if (!hostelRoom)     missing.push("hostelRoom");
    if (!destination)    missing.push("destination");
    if (!reason)         missing.push("reason");
    if (!leaveDateFrom)  missing.push("leaveDateFrom");
    if (!leaveDateTo)    missing.push("leaveDateTo");
    if (!parentRelation) missing.push("parentRelation");
    if (!parentContact)  missing.push("parentContact");

    if (missing.length) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
    }

    const outpass = await Outpass.create({
      student: req.user._id,
      studentName, studentId, hostelRoom,
      destination, reason,
      leaveDateFrom, leaveDateTo,
      timeFrom, timeTo,
      parentRelation, parentContact, parentEmail,
    });

    // Fire n8n webhook (non-blocking) — n8n sends email/WhatsApp/voice with these links
    axios.post(N8N_WEBHOOK, {
      outpassId:    outpass._id.toString(),
      studentName, studentId, hostelRoom,
      destination, reason,
      leaveDateFrom, leaveDateTo,
      parentEmail, parentContact, parentRelation,
      approveUrl: `${BASE_URL}/api/outpass/approve/${outpass._id}`,
      rejectUrl:  `${BASE_URL}/api/outpass/reject/${outpass._id}`,
    }).catch((err) => console.warn("n8n webhook failed:", err.message));

    return res.status(201).json({ message: "Outpass request submitted successfully", outpass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get student's own outpasses ───────────────────────────────────────────────
exports.getStudentOutpasses = async (req, res) => {
  try {
    const outpasses = await Outpass.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ message: "Fetched successfully", count: outpasses.length, outpasses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get single outpass ────────────────────────────────────────────────────────
exports.getOutpassById = async (req, res) => {
  try {
    const outpass = await Outpass.findById(req.params.id);
    if (!outpass) return res.status(404).json({ message: "Outpass not found" });
    if (outpass.student.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Access denied" });
    res.status(200).json({ outpass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Parent dashboard ──────────────────────────────────────────────────────────
exports.getParentOutpasses = async (req, res) => {
  try {
    const parent = await User.findById(req.user._id);
    const passes = await Outpass.find({ student: parent.student })
      .populate("student", "name studentId hostelRoom");
    res.json(passes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  // Get all outpasses — especially those in "pending-admin" state
exports.adminGetAllOutpasses = async (req, res) => {
  try {
    const { status } = req.query; // ?status=pending-admin
    const filter = status ? { status } : {};
    const outpasses = await Outpass.find(filter)
      .populate("student", "name email")
      .sort({ createdAt: -1 });
    res.json({ outpasses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin makes final approve/reject after reviewing media
exports.adminFinalDecision = async (req, res) => {
  try {
    const { decision, adminNote } = req.body; // "approved" or "rejected"
    if (!["approved", "rejected"].includes(decision))
      return res.status(400).json({ message: "Invalid decision" });

    const outpass = await Outpass.findByIdAndUpdate(
      req.params.id,
      { status: decision, adminNote, adminDecidedAt: new Date() },
      { new: true }
    );
    if (!outpass) return res.status(404).json({ message: "Not found" });

    // Optionally fire n8n to notify student
    axios.post(N8N_WEBHOOK, {
      event: "admin-decision",
      outpassId: outpass._id,
      studentName: outpass.studentName,
      decision,
    }).catch(() => {});

    res.json({ message: `Outpass ${decision}`, outpass });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
