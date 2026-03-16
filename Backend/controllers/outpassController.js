// backend/controllers/outpassController.js
const Outpass    = require("../models/Outpass");
const User       = require("../models/User");
const axios      = require("axios");
const multer     = require("multer");
const cloudinary = require("../config/cloudinary");

const N8N_WEBHOOK = process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/outpass-request";

const storage = multer.memoryStorage();
const upload  = multer({ storage });

exports.verifyWithMedia = async (req, res) => {
  try {
    const outpass = await Outpass.findById(req.params.id);
    if (!outpass)
      return res.status(404).json({ message: "Outpass not found" });

    // Allow retry unless admin already made final decision
    if (outpass.status === "approved" || outpass.status === "rejected")
      return res.status(400).json({ message: "This outpass has already been finalized by admin." });

    const { decision } = req.body;
    const photo = req.files?.photo?.[0];
    const video = req.files?.video?.[0];

    if (!decision || !photo || !video)
      return res.status(400).json({ message: "Photo, video and decision are all required." });

    // Verify Cloudinary is configured before attempting upload
    if (!process.env.CLOUDINARY_API_KEY) {
      console.error("❌ CLOUDINARY_API_KEY is missing from .env");
      return res.status(500).json({ message: "Server configuration error: Cloudinary not configured." });
    }

    // Upload photo
    const photoUrl = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "outpass/parent-photos", resource_type: "image" },
        (error, result) => (error ? reject(error) : resolve(result.secure_url))
      );
      stream.end(photo.buffer);
    });

    // Upload video
    const videoUrl = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "outpass/parent-videos", resource_type: "video" },
        (error, result) => (error ? reject(error) : resolve(result.secure_url))
      );
      stream.end(video.buffer);
    });

    await Outpass.findByIdAndUpdate(req.params.id, {
      parentDecision:  decision,
      parentPhotoPath: photoUrl,
      parentVideoPath: videoUrl,
      verifiedAt:      new Date(),
      status:          "pending-admin",
    });

    res.json({ message: "Verification submitted successfully", photoUrl, videoUrl });

  } catch (error) {
    console.error("verifyWithMedia error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

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

    if (missing.length)
      return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });

    const outpass = await Outpass.create({
      student: req.user._id,
      studentName, studentId, hostelRoom,
      destination, reason,
      leaveDateFrom, leaveDateTo,
      timeFrom, timeTo,
      parentRelation, parentContact, parentEmail,
    });

    axios.post(N8N_WEBHOOK, {
      outpassId: outpass._id.toString(),
      studentName, studentId, hostelRoom,
      destination, reason,
      leaveDateFrom, leaveDateTo,
      parentEmail, parentContact, parentRelation,
      approveUrl: `${process.env.FRONTEND_URL}/verify/${outpass._id}?decision=approved`,
      rejectUrl:  `${process.env.FRONTEND_URL}/verify/${outpass._id}?decision=rejected`,
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

// ── Admin: get all outpasses ──────────────────────────────────────────────────
exports.adminGetAllOutpasses = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const outpasses = await Outpass.find(filter)
      .populate("student", "name email")
      .sort({ createdAt: -1 });
    res.json({ outpasses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Admin: final approve / reject ─────────────────────────────────────────────
exports.adminFinalDecision = async (req, res) => {
  try {
    const { decision, adminNote } = req.body;
    if (!["approved", "rejected"].includes(decision))
      return res.status(400).json({ message: "Invalid decision" });

    const outpass = await Outpass.findByIdAndUpdate(
      req.params.id,
      { status: decision, adminNote, adminDecidedAt: new Date() },
      { new: true }
    );
    if (!outpass) return res.status(404).json({ message: "Not found" });

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