import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

async function initializeAdmin() {
  try {
    console.log('[v0] Connecting to MongoDB...');
    
    if (!process.env.MONGODB_URI) {
      console.log('[v0] Warning: MONGODB_URI not set. Using local MongoDB.');
      await mongoose.connect('mongodb://localhost:27017/mukhayam-tulaabi');
    } else {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    
    console.log('[v0] Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await Admin.findOne();
    
    if (existingAdmin) {
      console.log('[v0] Admin already exists. No changes made.');
    } else {
      // Create default admin with PIN 5022
      const newAdmin = new Admin({ pin: '5022' });
      await newAdmin.save();
      console.log('[v0] Admin created with default PIN: 5022');
      console.log('[v0] IMPORTANT: Change this PIN in production!');
    }
    
    await mongoose.connection.close();
    console.log('[v0] Initialization complete');
  } catch (error) {
    console.error('[v0] Error during initialization:', error);
    process.exit(1);
  }
}

initializeAdmin();
