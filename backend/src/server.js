const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registrations');
const statsRoutes = require('./routes/stats');
const analyticsRoutes = require('./routes/analytics');
const errorHandler = require('./middlewares/errorHandler');
const websocketService = require('./services/websocketService');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.'
  }
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '2.1.0'
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'EventHub API',
    version: '2.1.0',
    description: 'Professional Event Registration System API with Real-time Analytics',
    features: [
      'JWT Authentication',
      'Role-based Access Control',
      'Real-time Analytics',
      'Email Notifications',
      'File Upload Support',
      'Advanced Search & Filtering',
      'Bulk Operations',
      'Data Export'
    ],
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      events: '/api/events',
      registrations: '/api/registrations',
      stats: '/api/stats',
      analytics: '/api/analytics',
      health: '/api/health'
    },
    documentation: 'https://github.com/your-repo/eventhub-api',
    support: 'support@eventhub.com'
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    suggestion: 'Check the API documentation at /api'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  websocketService.shutdown();
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  websocketService.shutdown();
  server.close(() => {
    process.exit(0);
  });
});

// Initialize WebSocket service
websocketService.initialize(server);

server.listen(PORT, () => {
  console.log(`🚀 EventHub API Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API Documentation: http://localhost:${PORT}/api`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`⚡ Real-time Analytics: Enabled`);
  console.log(`🔌 WebSocket Server: Active`);
});