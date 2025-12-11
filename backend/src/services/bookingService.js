const Booking = require('../models/Booking');
const Court = require('../models/Court');
const Coach = require('../models/Coach');
const Equipment = require('../models/Equipment');
const pricingService = require('./pricingService');

function isOverlapping(existing, reqStart, reqEnd) {
  return (
    new Date(existing.startTime) < new Date(reqEnd) &&
    new Date(existing.endTime) > new Date(reqStart)
  );
}

async function checkCourtAvailability(courtId, startTime, endTime) {
  const bookings = await Booking.find({ court: courtId, status: "CONFIRMED" });
  for (const b of bookings) {
    if (isOverlapping(b, startTime, endTime)) {
      throw new Error('Court is already booked for this time.');
    }
  }
}

async function checkCoachAvailability(coachId, startTime, endTime) {
  if (!coachId) return;
  const bookings = await Booking.find({ coach: coachId, status: "CONFIRMED" });
  for (const b of bookings) {
    if (isOverlapping(b, startTime, endTime)) {
      throw new Error('Coach is not available for this time.');
    }
  }
}

async function checkEquipmentAvailability(equipment, startTime, endTime) {
  for (const item of equipment || []) {
    const equipmentData = await Equipment.findById(item.equipmentId);
    if (!equipmentData || !equipmentData.isActive) {
      throw new Error('Equipment unavailable.');
    }

    const overlappingBookings = await Booking.find({
      'equipment.equipmentId': item.equipmentId,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
      status: "CONFIRMED"
    });

    const alreadyBookedAmount = overlappingBookings.reduce((sum, b) => {
      const eq = b.equipment.find(e => e.equipmentId.toString() === item.equipmentId);
      return sum + (eq?.quantity || 0);
    }, 0);

    if (alreadyBookedAmount + item.quantity > equipmentData.stock) {
      throw new Error(`Not enough ${equipmentData.name} in stock.`);
    }
  }
}

exports.createBooking = async (data) => {
  const userId = data.userId || "000000000000000000000001"; // MOCK USER until auth ready
  const { courtId, startTime, endTime, equipment = [], coachId } = data;

  await checkCourtAvailability(courtId, startTime, endTime);
  await checkCoachAvailability(coachId, startTime, endTime);
  await checkEquipmentAvailability(equipment, startTime, endTime);

  const pricingBreakdown = await pricingService.calculatePrice(data);

  const booking = await Booking.create({
    user: userId,
    court: courtId,
    startTime,
    endTime,
    equipment,
    coach: coachId,
    pricingBreakdown,
    status: "CONFIRMED"
  });

  return booking.populate('court coach equipment.equipmentId');
};

exports.getUserBookings = async (userId) => {
  return Booking.find({ user: userId }).populate('court coach equipment.equipmentId');
};
