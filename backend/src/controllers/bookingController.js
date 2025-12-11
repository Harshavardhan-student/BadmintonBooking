const bookingService = require('../services/bookingService');

exports.createBooking = async (req, res) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.headers['x-user-id']; // temporary mock auth
    const bookings = await bookingService.getUserBookings(userId);
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
