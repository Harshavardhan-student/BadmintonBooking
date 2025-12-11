require('dotenv').config();
const mongoose = require('mongoose');

const Court = require('./src/models/Court');
const Equipment = require('./src/models/Equipment');
const Coach = require('./src/models/Coach');
const PricingRule = require('./src/models/PricingRule');

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/badminton_booking';
  await mongoose.connect(uri);

  try {
    // Clear existing
    await Promise.all([
      Court.deleteMany({}),
      Equipment.deleteMany({}),
      Coach.deleteMany({}),
      PricingRule.deleteMany({}),
    ]);

    // Insert courts
    await Court.insertMany([
      { name: 'Court 1', type: 'INDOOR', baseRatePerHour: 30 },
      { name: 'Court 2', type: 'INDOOR', baseRatePerHour: 30 },
      { name: 'Court 3', type: 'OUTDOOR', baseRatePerHour: 20 },
      { name: 'Court 4', type: 'OUTDOOR', baseRatePerHour: 20 },
    ]);

    // Insert equipment
    await Equipment.insertMany([
      { name: 'Racket', type: 'RACKET', stock: 20, pricePerUnit: 10 },
      { name: 'Shoes', type: 'SHOES', stock: 15, pricePerUnit: 8 },
    ]);

    // Insert coaches with availability as day/start/end objects
    await Coach.insertMany([
      { name: 'Coach A', specialization: 'General', isActive: true, availability: [ { day: 'MON', start: '10:00', end: '14:00' }, { day: 'WED', start: '10:00', end: '14:00' } ] },
      { name: 'Coach B', specialization: 'Advanced', isActive: true, availability: [ { day: 'TUE', start: '12:00', end: '16:00' }, { day: 'THU', start: '12:00', end: '16:00' } ] },
      { name: 'Coach C', specialization: 'Beginner', isActive: true, availability: [ { day: 'FRI', start: '09:00', end: '12:00' }, { day: 'SAT', start: '09:00', end: '12:00' } ] },
    ]);

    // Insert pricing rules (use uppercase ruleType matching schema)
    await PricingRule.insertMany([
      { ruleType: 'PEAK_HOURS', config: { startTime: '18:00', endTime: '21:00', multiplier: 1.5 }, isActive: true },
      { ruleType: 'WEEKEND', config: { multiplier: 1.2 }, isActive: true },
      { ruleType: 'INDOOR_PREMIUM', config: { multiplier: 1.1 }, isActive: true },
    ]);

    console.log('Seed data inserted');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
