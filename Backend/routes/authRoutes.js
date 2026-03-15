const express = require("express");

const {
studentSignup,
parentSignup,
adminSignup,
loginUser,
getProfile
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// STUDENT
router.post("/student/signup",studentSignup);
router.post("/student/login",loginUser);


// PARENT
router.post("/parent/signup",parentSignup);
router.post("/parent/login",loginUser);


// ADMIN
router.post("/admin/signup",adminSignup);
router.post("/admin/login",loginUser);


// PROFILE
router.get("/profile",protect,getProfile);

module.exports = router;