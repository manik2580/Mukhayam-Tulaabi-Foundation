import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import path from 'path';
import { fileURLToPath } from 'url';
import donorRoutes from './routes/donors.js';
import expenseRoutes from './routes/expenses.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
if (process.env.MONGODB_URI) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions',
      }),
      cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
    })
  );
} else {
  // Fallback for development without MongoDB
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
    })
  );
}

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
} else {
  console.log('⚠️ MONGODB_URI not set. Using in-memory storage.');
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/expenses', expenseRoutes);

// API endpoint to get all data
app.get('/api/data', async (req, res) => {
  try {
    const Donor = mongoose.model('Donor');
    const Expense = mongoose.model('Expense');

    const donors = await Donor.find().sort({ date: -1 });
    const expenses = await Expense.find().sort({ createdAt: -1 });

    res.json({ donors, expenses });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
