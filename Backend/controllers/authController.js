const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const path = require("path");
const fs = require("fs");

// STUDENT SIGNUP
exports.studentSignup = async (req, res) => {
  try {
    const { name, email, password, studentId, hostelRoom, phone } = req.body;

    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      studentId,
      hostelRoom,
      phone,
    });

    // Return response matching what frontend expects
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });

  } catch (error) {
    console.error("Student signup error:", error);
    res.status(500).json({ message: error.message });
  }
};

// PARENT SIGNUP
exports.parentSignup = async (req, res) => {
  try {
    const { name, email, password, phone, relation, student } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "parent",
      phone,
      relation,
      student, // 🔗 link to student
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });

  } catch (error) {
    console.error("Parent signup error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ADMIN SIGNUP
exports.adminSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });

  } catch (error) {
    console.error("Admin signup error:", error);
    res.status(500).json({ message: error.message });
  }
};

// LOGIN (COMMON FOR ALL)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ADMIN PROFILE
exports.updateAdminProfile = async (req, res) => {
  try {
    const { name, email, phone, bio, designation, department } = req.body;

    const updateData = { name, email, phone, bio, designation, department };

    // If a new avatar was uploaded
    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
    }

    const updatedAdmin = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({
      admin: updatedAdmin,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("Update admin profile error:", error);
    res.status(500).json({ message: error.message });
  }
};

// CHANGE ADMIN PASSWORD
exports.changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE STUDENT PROFILE
exports.updateStudentProfile = async (req, res) => {
  try {
    const { name, email, phone, bio, collegeId, hostelRoom, department, year } = req.body;

    const updateData = { name, email, phone, bio, collegeId, hostelRoom, department, year };

    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
    }

    const updatedStudent = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      student: updatedStudent,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("Update student profile error:", error);
    res.status(500).json({ message: error.message });
  }
};

// CHANGE STUDENT PASSWORD
exports.changeStudentPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change student password error:", error);
    res.status(500).json({ message: error.message });
  }
};

// PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};