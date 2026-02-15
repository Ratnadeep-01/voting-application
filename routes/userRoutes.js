const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');
const { jwtAuthMiddleware, generateToken } = require('../jwt');

/* ================= SIGNUP ================= */
router.post('/signup', async (req, res) => {
  try {
    const data = req.body;

    // hash password
    const saltRounds = 10;
    data.password = await bcrypt.hash(data.password, saltRounds);

    const newUser = new User(data);
    const response = await newUser.save();

    const payload = {
      id: response._id,
      username: response.username,
      role: response.role,
    };

    const token = generateToken(payload);

    res.status(201).json({
      message: 'User created successfully',
      token,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* ================= LOGIN ================= */
router.post('/login', async (req, res) => {
  try {
    const { adharCardNumber, password } = req.body;

    const user = await User.findOne({ adharCardNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const payload = {
      id: user._id,
      username: user.username,
      role: user.role,
    };

    const token = generateToken(payload);

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* ================= PROFILE ================= */
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* ================= UPDATE PASSWORD ================= */
router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid old password' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
