const Coach = require('../models/Coach');

exports.getCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find();
    res.json(coaches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCoach = async (req, res) => {
  try {
    const coach = new Coach(req.body);
    const saved = await coach.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateCoach = async (req, res) => {
  try {
    const updated = await Coach.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCoach = async (req, res) => {
  try {
    const updated = await Coach.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
