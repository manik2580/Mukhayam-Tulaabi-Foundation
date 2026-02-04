import express from 'express';
import Expense from '../models/Expense.js';

const router = express.Router();

// Middleware to check admin status
const checkAdmin = (req, res, next) => {
  if (!req.session.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
};

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Add new expense (admin only)
router.post('/', checkAdmin, async (req, res) => {
  try {
    const { name, amount } = req.body;

    if (!name || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newExpense = new Expense({
      name,
      amount: Number(amount),
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// Delete expense (admin only)
router.delete('/:id', checkAdmin, async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

export default router;
