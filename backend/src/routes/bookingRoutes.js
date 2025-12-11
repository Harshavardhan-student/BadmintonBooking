const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookingController');

router.post('/', controller.createBooking);
router.get('/me', controller.getMyBookings);

module.exports = router;
