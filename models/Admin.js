import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    pin: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash PIN before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('pin')) return next();
  try {
    const salt = await bcryptjs.genSalt(10);
    this.pin = await bcryptjs.hash(this.pin, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare PIN
adminSchema.methods.comparePin = async function (inputPin) {
  return await bcryptjs.compare(inputPin, this.pin);
};

export default mongoose.model('Admin', adminSchema);
