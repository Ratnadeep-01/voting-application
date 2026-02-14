const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');
const { jwtAuthMiddleware, generateToken } = require('../jwt');

/* ================= SIGNUP ================= */
router.post('/signup', async (req, res) => {
  try {
    const data = req.body;

    // Basic validation
    if (!data.adharCardNumber || data.adharCardNumber.length !== 12) {
      return res.status(400).json({ error: 'Adhar Card Number must be 12 digits' });
    }
    if (data.age < 18) {
      return res.status(400).json({ error: 'User must be at least 18 years old' });
    }

    // hash password
    const saltRounds = 10;
    data.password = await bcrypt.hash(data.password, saltRounds);

    const newUser = new User(data);
    const response = await newUser.save();

    const payload = {
      id: response.id,
      name: response.name,
      role: response.role,
    };

    const token = generateToken(payload);

    res.status(201).json({
      message: 'User created successfully',
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Adhar Card Number already exists' });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* ================= LOGIN ================= */
router.post('/login', async (req, res) => {
  try {
    const { adharCardNumber, password } = req.body;

    // Prevent NoSQL injection by ensuring they are strings
    if (typeof adharCardNumber !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid input format' });
    }

    const user = await User.findOne({ adharCardNumber });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const payload = {
      id: user.id,
      name: user.name,
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
    console.log('Fetching profile for user ID:', req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('User not found in database for ID:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
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
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid old password' });
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
