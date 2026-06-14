const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config({ path: '../../.env' }); // Load from root .env if necessary, or local

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

const routes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');

// Routes
app.use('/api/v1', routes);

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

// Hanya jalankan app.listen jika tidak di serverless environment (seperti Vercel)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
