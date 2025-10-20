// backend/server.js
// Load dotenv FIRST
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

// CORS Configuration - Secure for production
const allowedOrigins = [
  'http://localhost:5173', // Local development
  'http://localhost:3000', // Alternative local port
  process.env.FRONTEND_URL, // Production frontend (from env variable)
];

// Add Codespaces URL if in development
if (NODE_ENV === 'development') {
  allowedOrigins.push('https://orange-goldfish-pj6p5g7vqw9r97vp-5173.app.github.dev');
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'CineScope API', 
    version: '1.0.0',
    status: 'running',
    environment: NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/favorites', favoriteRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CineScope API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('🎬 ===================================');
  console.log(`   CineScope Backend Server`);
  console.log('   ===================================');
  console.log(`   Environment: ${NODE_ENV}`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Status: ✅ Running`);
  console.log('   ===================================');
  
  if (NODE_ENV === 'development') {
    console.log(`📡 Local: http://localhost:${PORT}/api`);
    console.log(`🌍 Network: Check your network IP`);
  } else {
    console.log(`🌐 Production URL: ${process.env.FRONTEND_URL || 'Not set'}`);
  }
  
  console.log('🎬 ===================================\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

module.exports = app;