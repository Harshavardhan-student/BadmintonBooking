const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  startTime: Date,
  endTime: Date
});

const coachSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialization: { type: String },
    isActive: { type: Boolean, default: true },
    availability: [availabilitySchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coach', coachSchema);
