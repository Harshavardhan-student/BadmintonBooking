const pricingService = require('../services/pricingService');

exports.getQuote = async (req, res) => {
  try {
    const breakdown = await pricingService.calculatePrice(req.body);
    res.json(breakdown);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
