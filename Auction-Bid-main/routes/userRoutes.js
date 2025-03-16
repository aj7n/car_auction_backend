const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Create a User (POST /users)
router.post("/", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        console.error("Email already in use:", err.message);
      return res.status(400).json({ error: "Email already in use" });
    }

    const newUser = new User({ firstname, lastname, email, password });
    await newUser.save();
    
    res.status(201).json({
      _id: newUser._id,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      createddate: newUser.createddate,
    });
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// Get User by Email & Password (GET /users?email=...&password=...)
router.get("/", async (req, res) => {
  try {
    const { email, password } = req.query;
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      createddate: user.createddate,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
// Get User by ID (GET /users/:id)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      createddate: user.createddate,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
