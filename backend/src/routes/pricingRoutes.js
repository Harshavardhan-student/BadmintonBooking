const express = require('express');
const router = express.Router();
const controller = require('../controllers/pricingController');

router.post('/quote', controller.getQuote);

module.exports = router;
