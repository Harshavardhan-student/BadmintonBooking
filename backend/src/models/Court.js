const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['INDOOR', 'OUTDOOR'], required: true },
    isActive: { type: Boolean, default: true },
    baseRatePerHour: { type: Number, default: 20 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Court', courtSchema);
