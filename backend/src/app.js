const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const courtRoutes = require('./routes/courtRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const coachRoutes = require('./routes/coachRoutes');
const pricingRuleRoutes = require('./routes/pricingRuleRoutes');
const pricingRoutes = require('./routes/pricingRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.get('/', (req, res) => {
  res.send({ message: 'Backend running 🚀' });
});

app.use('/api/admin/courts', courtRoutes);
app.use('/api/admin/equipment', equipmentRoutes);
app.use('/api/admin/coaches', coachRoutes);
app.use('/api/admin/pricing-rules', pricingRuleRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/bookings', bookingRoutes);

module.exports = app;
