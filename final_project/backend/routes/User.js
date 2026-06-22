const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST /api/user/by-email
router.post("/by-email", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      role: user.role, // 👈 This is what you'll use to decide rendering
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
