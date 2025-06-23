const express = require('express');
const cors = require('cors');
const facilityRoutes = require('./routes/facilities');
const regionRoutes = require('./routes/regions');
const casesRoutes = require('./routes/cases');
const authRoutes = require('./routes/auth');
const alertRoutes = require('./routes/alerts');
const statisticsRoutes = require('./routes/statistics');
const app = express();
require('dotenv').config();
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded form data
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use('/api/facilities', require('./routes/facilities'));
app.use('/api/regions', require('./routes/regions'));

app.use('/api/statistics', statisticsRoutes);

app.use('/api/alerts', alertRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/regions', regionRoutes);
app.use('/api/diseases', require('./routes/diseases'));
app.use(express.json());
app.use('/api/cases', casesRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
