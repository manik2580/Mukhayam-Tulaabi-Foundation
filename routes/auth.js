import express from 'express';
import Admin from '../models/Admin.js';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({ error: 'PIN is required' });
    }

    // Find admin (assuming there's only one admin)
    const admin = await Admin.findOne();

    if (!admin) {
      // If no admin exists, create one with default PIN
      const newAdmin = new Admin({ pin: '5022' });
      await newAdmin.save();
      const match = await newAdmin.comparePin(pin);
      if (!match) {
        return res.status(401).json({ error: 'Invalid security code' });
      }
    } else {
      // Compare PIN
      const match = await admin.comparePin(pin);
      if (!match) {
        return res.status(401).json({ error: 'Invalid security code' });
      }
    }

    // Set session
    req.session.isAdmin = true;
    res.json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logout successful' });
  });
});

// Check auth status
router.get('/status', (req, res) => {
  res.json({ isAdmin: req.session.isAdmin || false });
});

export default router;
