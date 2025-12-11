const mongoose = require('mongoose');

const pricingRuleSchema = new mongoose.Schema(
  {
    ruleType: { type: String, enum: ['PEAK_HOURS', 'WEEKEND', 'INDOOR_PREMIUM', 'EQUIPMENT_FEE', 'COACH_FEE'], required: true },
    config: { type: mongoose.Schema.Types.Mixed, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PricingRule', pricingRuleSchema);
