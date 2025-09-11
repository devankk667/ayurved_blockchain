require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Import config
const config = require('./config/config');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

// Import routes
const batchRoutes = require('./routes/batch.routes');

// Initialize express app
const app = express();

// --- Middleware ---

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors(config.corsOptions));

// Request logging
app.use(morgan('dev'));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

// --- API Documentation ---
if (process.env.NODE_ENV !== 'production') {
  try {
    const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } catch (error) {
    console.warn('Failed to load Swagger documentation:', error.message);
  }
}

// --- Routes ---
app.use('/api/batch', batchRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    nodeEnv: config.nodeEnv,
    version: process.env.npm_package_version
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

module.exports = app;