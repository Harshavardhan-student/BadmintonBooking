const mongoose = require('mongoose');

const equipmentItemSchema = new mongoose.Schema({
  equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  quantity: { type: Number, required: true }
});

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    equipment: [equipmentItemSchema],
    coach: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach' },
    status: { type: String, enum: ['CONFIRMED', 'CANCELLED', 'WAITLIST'], default: 'CONFIRMED' },
    pricingBreakdown: { type: Object, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
