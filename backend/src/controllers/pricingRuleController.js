const PricingRule = require('../models/PricingRule');

exports.getRules = async (req, res) => {
  try {
    const rules = await PricingRule.find();
    res.json(rules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRule = async (req, res) => {
  try {
    const rule = new PricingRule(req.body);
    const saved = await rule.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateRule = async (req, res) => {
  try {
    const updated = await PricingRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteRule = async (req, res) => {
  try {
    const updated = await PricingRule.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
