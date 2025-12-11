const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['RACKET', 'SHOES'], required: true },
    stock: { type: Number, default: 10 },
    pricePerUnit: { type: Number, default: 5 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Equipment', equipmentSchema);
