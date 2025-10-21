// backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
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
  process.env.FRONTEND_URL // Add your Vercel URL here
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// API ROUTES
// ============================================
app.get('/', (req, res) => {
  res.json({ 
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

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/favorites', favoriteRoutes);

// Health check endpoint
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
// SERVE FRONTEND (Optional - for full-stack deployment)
// ============================================
// Uncomment this section if deploying frontend + backend together
/*
if (NODE_ENV === 'production') {
  // Serve static files from React build
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  // Handle React routing - return index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}
*/

// ============================================
// ERROR HANDLING
// ============================================
// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `API route not found: ${req.originalUrl}` 
  });
});

// General 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Global error handler
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(50));
  console.log('🎬  CineScope Backend Server');
  console.log('='.repeat(50));
  console.log(`📍 Environment:  ${NODE_ENV}`);
  console.log(`🚀 Port:         ${PORT}`);
  console.log(`✅ Status:       Running`);
  console.log('='.repeat(50));
  
  if (NODE_ENV === 'development') {
    console.log(`\n📡 Local API:    http://localhost:${PORT}/api`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  } else {
    console.log(`\n🌐 Production:   https://cinescope-backend-l93r.onrender.com`);
    console.log(`🔗 Frontend:     ${process.env.FRONTEND_URL || 'Not configured'}`);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
const gracefulShutdown = (signal) => {
  console.log(`\n👋 ${signal} received. Shutting down gracefully...`);
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

module.exports = app;