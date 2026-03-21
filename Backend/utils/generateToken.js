// backend/utils/generateToken.js
//
// ── FIX (Issue 2): Changed expiry from the default short value to "30d".
//    The frontend AuthContext already auto-logs out when the token expires,
//    so a longer server-side expiry simply means users won't be randomly
//    kicked out after ~5 hours of normal use.
//
//    If you want stricter security, change "30d" to "7d" or "1d".
// ─────────────────────────────────────────────────────────────────────────────

const jwt = require("jsonwebtoken");

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });

module.exports = generateToken;