// backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================
// CORS CONFIGURATION
// ============================================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://orange-goldfish-pj6p5g7vqw9r97vp-5173.app.github.dev',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins
    if (NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // In production, check allowed origins
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked:', origin);
      console.log('📋 Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// ROOT ENDPOINT
// ============================================
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: '🎬 CineScope API', 
    version: '1.0.0',
    status: 'running',
    environment: NODE_ENV,
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      movies: '/api/movies',
      favorites: '/api/favorites'
    }
  });
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'OK', 
    message: 'CineScope API is healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: NODE_ENV,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
    }
  });
});

// ============================================
// API ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/favorites', favoriteRoutes);

// ============================================
// ERROR HANDLING
// ============================================
// 404 handler for API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ 
      success: false, 
      message: `API route not found: ${req.originalUrl}` 
    });
  }
  next();
});

// General 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(60));
  console.log('🎬  CineScope Backend Server');
  console.log('='.repeat(60));
  console.log(`📍 Environment:  ${NODE_ENV}`);
  console.log(`🚀 Port:         ${PORT}`);
  console.log(`✅ Status:       Running`);
  console.log(`🕐 Started:      ${new Date().toISOString()}`);
  console.log('='.repeat(60));
  
  if (NODE_ENV === 'development') {
    console.log(`\n📡 Local API:    http://localhost:${PORT}/api`);
    console.log(`🏥 Health:       http://localhost:${PORT}/api/health`);
  } else {
    console.log(`\n🌐 Production:   ${process.env.RENDER_EXTERNAL_URL || 'N/A'}`);
    console.log(`🔗 Frontend:     ${process.env.FRONTEND_URL || 'Not configured'}`);
  }
  
  console.log(`\n🔧 Allowed Origins:`);
  allowedOrigins.forEach(origin => {
    console.log(`   ✓ ${origin}`);
  });
  
  console.log('\n' + '='.repeat(60) + '\n');
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
const gracefulShutdown = (signal) => {
  console.log(`\n👋 ${signal} received. Shutting down gracefully...`);
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    console.log('👋 Goodbye!');
    process.exit(0);
  });
  
  // Force shutdown after 10 seconds if connections don't close
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error(error.stack);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  gracefulShutdown('unhandledRejection');
});

module.exports = app;