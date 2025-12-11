const Court = require('../models/Court');
const Coach = require('../models/Coach');
const Equipment = require('../models/Equipment');
const PricingRule = require('../models/PricingRule');

function isWeekend(date) {
  const day = new Date(date).getDay();
  return day === 0 || day === 6;
}

exports.calculatePrice = async ({ courtId, startTime, endTime, equipment = [], coachId }) => {
  const court = await Court.findById(courtId);
  if (!court) throw new Error('Court not found');

  const durationHours = (new Date(endTime) - new Date(startTime)) / 1000 / 3600;
  const rules = await PricingRule.find({ isActive: true });

  let total = 0;
  let breakdown = {
    baseCourtPrice: court.baseRatePerHour * durationHours,
    indoorPremium: 0,
    peakSurcharge: 0,
    weekendSurcharge: 0,
    equipmentFees: 0,
    coachFee: 0
  };

  total += breakdown.baseCourtPrice;

  for (const rule of rules) {
    if (rule.ruleType === 'INDOOR_PREMIUM' && court.type === 'INDOOR') {
      breakdown.indoorPremium += rule.config.flatFee || 0;
      total += rule.config.flatFee || 0;
    }

    if (rule.ruleType === 'WEEKEND' && isWeekend(startTime)) {
      const val = breakdown.baseCourtPrice * ((rule.config.multiplier || 1) - 1);
      breakdown.weekendSurcharge += val;
      total += val;
    }

    if (rule.ruleType === 'PEAK_HOURS') {
      const hour = new Date(startTime).getHours();
      if (hour >= rule.config.startHour && hour < rule.config.endHour) {
        const val = breakdown.baseCourtPrice * ((rule.config.multiplier || 1) - 1);
        breakdown.peakSurcharge += val;
        total += val;
      }
    }

    if (rule.ruleType === 'EQUIPMENT_FEE') {
      for (const item of equipment) {
        breakdown.equipmentFees += (item.quantity * rule.config.pricePerUnit);
      }
      total += breakdown.equipmentFees;
    }

    if (rule.ruleType === 'COACH_FEE' && coachId) {
      breakdown.coachFee += rule.config.flatFee || 0;
      total += rule.config.flatFee || 0;
    }
  }

  breakdown.total = total;
  return breakdown;
};
