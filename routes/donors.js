import express from 'express';
import Donor from '../models/Donor.js';

const router = express.Router();

// Middleware to check admin status
const checkAdmin = (req, res, next) => {
  if (!req.session.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
};

// Get all donors
router.get('/', async (req, res) => {
  try {
    const donors = await Donor.find().sort({ date: -1 });
    res.json(donors);
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({ error: 'Failed to fetch donors' });
  }
});

// Add new donor (admin only)
router.post('/', checkAdmin, async (req, res) => {
  try {
    const { name, date, amount } = req.body;

    if (!name || !date || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newDonor = new Donor({
      name,
      date: new Date(date),
      amount: Number(amount),
    });

    await newDonor.save();
    res.status(201).json(newDonor);
  } catch (error) {
    console.error('Error adding donor:', error);
    res.status(500).json({ error: 'Failed to add donor' });
  }
});

// Delete donor (admin only)
router.delete('/:id', checkAdmin, async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);

    if (!donor) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    res.json({ message: 'Donor deleted successfully' });
  } catch (error) {
    console.error('Error deleting donor:', error);
    res.status(500).json({ error: 'Failed to delete donor' });
  }
});

export default router;
