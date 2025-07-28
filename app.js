require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const PropertyListing  = require('./models/PropertyListing');
const Roommate         = require('./models/RoommateRequest');          // if you have one
const logEvent         = require('./utils/logEvent');           // ← NEW LINE

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// MIDDLEWARE - MUST BE FIRST!
// ==========================================

// Basic middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your React app URL
  credentials: true
}));
app.use(express.json());

// ENSURE UPLOADS DIRECTORY EXISTS - VERY IMPORTANT!
const uploadsDir = path.join(__dirname, 'uploads');
const propertiesDir = path.join(__dirname, 'uploads', 'properties');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('✅ Created uploads directory');
}
if (!fs.existsSync(propertiesDir)) {
  fs.mkdirSync(propertiesDir, { recursive: true });
  console.log('✅ Created uploads/properties directory');
}

// SERVE STATIC FILES FOR PHOTOS - VERY IMPORTANT!
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('📁 Static files served from:', path.join(__dirname, 'uploads'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/roomtopia')
.then(() => console.log('✅ MongoDB Connected to roomtopia database'))
.catch(err => console.error('❌ MongoDB Error:', err));

// ==========================================
// ALL ROUTES - DECLARED ONLY ONCE EACH!
// ==========================================

// Authentication routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Admin routes for user management - NEW!
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// Review routes for admin functionality
const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);

// Roommate request routes
const roommateRoutes = require('./routes/roommateRoutes');
app.use('/api/roommate-requests', roommateRoutes);

// Property listing routes (with photo upload support)
const propertyRoutes = require('./routes/propertyRoutes');
app.use('/api/properties', propertyRoutes);

// AI Matching routes
const aiMatchingRoutes = require('./routes/aiMatchingRoutes');
app.use('/api/ai-matching', aiMatchingRoutes);

// User routes for profile management
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// 📊 Analytics routes - ADD THIS NEW SECTION!
const analyticsRoutes = require('./routes/analyticsRoutes');
app.use('/api/analytics', analyticsRoutes);


// ==========================================
// TEST ROUTES
// ==========================================

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '🦕 Server is working super-dee-duper!', 
    timestamp: new Date().toISOString(),
    database: 'roomtopia'
  });
});

// Health check route - UPDATED WITH ADMIN ROUTES
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    server: 'Roomtopia Backend',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    port: process.env.PORT || 3001,
    routes: [
      '/api/auth',
      '/api/admin',           // NEW ADMIN ROUTES!
      '/api/reviews', 
      '/api/roommate-requests',
      '/api/properties',
      '/api/ai-matching'
    ],
    features: [
      '📸 Photo Upload Support',
      '🤖 AI Roommate Matching',
      '🏠 User Property Listings',
      '👥 Roommate Requests',
      '🔐 Authentication System',
      '👨‍💼 Admin User Management'  // NEW FEATURE!
    ],
    adminEndpoints: [
      'GET /api/admin/users - Get all users',
      'GET /api/admin/users/:id - Get single user',
      'DELETE /api/admin/users/:id - Delete user',
      'GET /api/admin/stats - Get admin statistics',
      'PATCH /api/admin/users/:id/status - Update user status'
    ],
    staticFiles: {
      uploadsDir: uploadsDir,
      propertiesDir: propertiesDir,
      uploadsExists: fs.existsSync(uploadsDir),
      propertiesExists: fs.existsSync(propertiesDir)
    }
  });
});

// Test photo serving - IMPROVED
app.get('/api/test-photo', (req, res) => {
  // Check if any photos exist
  const samplePhotos = fs.readdirSync(propertiesDir).filter(file => 
    file.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)
  );

  res.json({
    message: '📸 Photo serving test',
    uploadsDirectory: uploadsDir,
    propertiesDirectory: propertiesDir,
    samplePhotos: samplePhotos.slice(0, 3), // Show first 3 photos
    testUrls: samplePhotos.slice(0, 2).map(photo => 
      `http://localhost:3001/uploads/properties/${photo}`
    ),
    instructions: 'Upload photos through /api/properties/upload-photos'
  });
});

// DEDICATED IMAGE TEST ROUTE
app.get('/api/test-image/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(propertiesDir, filename);
  
  console.log('🖼️ Testing image:', imagePath);
  
  if (fs.existsSync(imagePath)) {
    console.log('✅ Image file exists');
    res.sendFile(imagePath);
  } else {
    console.log('❌ Image file not found');
    res.status(404).json({
      error: 'Image not found',
      path: imagePath,
      filename: filename
    });
  }
});

// ADMIN TEST ROUTE - NEW!
app.get('/api/admin-test', (req, res) => {
  res.json({
    message: '👨‍💼 Admin functionality test',
    timestamp: new Date().toISOString(),
    adminRoutes: [
      'GET /api/admin/users - List all users',
      'DELETE /api/admin/users/:id - Delete user',
      'GET /api/admin/stats - Get statistics'
    ],
    instructions: [
      '1. Login as admin first',
      '2. Use the token in Authorization header',
      '3. Access admin dashboard at /admin'
    ],
    testCredentials: {
      email: 'admin@roomtopia.com',
      password: 'admin123'
    }
  });
});

// ==========================================
// ERROR HANDLING - MUST BE LAST!
// ==========================================

// Multer error handling (for file uploads)
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'File too large. Maximum size is 5MB per photo.'
    });
  }
  
  if (err.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      error: 'Only image files are allowed. Please upload JPG, PNG, or GIF files.'
    });
  }
  
  next(err);
});

// General error handling middleware
app.use((err, req, res, next) => {
  console.error('🦕 Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

  // Serve uploaded files
app.use('/uploads', express.static('uploads'));

// 404 handler - MUST BE VERY LAST!
app.use('*', (req, res) => {
  console.log('❌ 404 - Route not found:', req.originalUrl);
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    message: '🦕 That route is hiding! Try a different one!',
    availableRoutes: [
      '/api/test',
      '/api/health',
      '/api/admin-test',      // NEW!
      '/api/auth',
      '/api/admin',           // NEW!
      '/api/properties',
      '/api/roommate-requests',
      '/api/ai-matching'
    ]
  });
});

// Start server - UPDATED CONSOLE LOGS
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend should connect to: http://localhost:${PORT}`);
  console.log(`🔗 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`👨‍💼 Admin test: http://localhost:${PORT}/api/admin-test`);
  console.log(`🏠 Roommate requests: http://localhost:${PORT}/api/roommate-requests`);
  console.log(`🏡 Property listings: http://localhost:${PORT}/api/properties`);
  console.log(`📸 Photo upload: http://localhost:${PORT}/api/properties/upload-photos`);
  console.log(`🤖 AI matching: http://localhost:${PORT}/api/ai-matching`);
  console.log(`👥 Admin users: http://localhost:${PORT}/api/admin/users`);
  console.log(`📊 Admin stats: http://localhost:${PORT}/api/admin/stats`);
  console.log(`💊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Static files: http://localhost:${PORT}/uploads/`);
  console.log(`🖼️ Images directory: ${propertiesDir}`);
  console.log(`\n🎯 ADMIN LOGIN: admin@roomtopia.com / admin123`);
});

module.exports = app;