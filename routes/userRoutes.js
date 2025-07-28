// routes/userRoutes.js - Enhanced with profile picture upload
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User'); // Add this import

const { 
  getUsersForMatching, 
  resetProfile 
} = require('../controllers/userController');

const auth = require('../middleware/auth');

// Create profile pictures directory
const profileUploadDir = 'uploads/profiles';
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
if (!fs.existsSync(profileUploadDir)) {
  fs.mkdirSync(profileUploadDir, { recursive: true });
}

// Configure multer for profile pictures
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function (req, file, cb) {
    const uniqueName = 'profile-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const profileUpload = multer({ 
  storage: profileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// 🆕 Profile picture upload route
router.post('/upload-profile-picture', profileUpload.single('profilePicture'), async (req, res) => {
  try {
    console.log('📸 Profile picture upload request received');
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No profile picture uploaded'
      });
    }

    const { userEmail } = req.body;
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        error: 'User email is required'
      });
    }

    // Update user's profile picture in database
    const profilePicturePath = `/uploads/profiles/${req.file.filename}`;
    
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { profilePicture: profilePicturePath },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    console.log('✅ Profile picture uploaded successfully');
    
    res.json({
      success: true,
      message: 'Profile picture uploaded successfully!',
      profilePicture: profilePicturePath
    });
    
  } catch (error) {
    console.error('❌ Profile picture upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload profile picture'
    });
  }
});

// 🆕 Update profile route (for profile information updates)
router.put('/profile', async (req, res) => {
  try {
    const { email, fullName, phoneNumber, university, faculty, year } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { 
        fullName,
        phoneNumber,
        university,
        faculty,
        year
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

// Roommate matching route (YOUR EXISTING CODE)
router.get('/match', auth, getUsersForMatching);

// Reset profile route (YOUR EXISTING CODE)
router.delete('/reset-profile', auth, resetProfile);

// Test route (UPDATED with new routes)
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'User routes are working with profile picture upload!',
    availableRoutes: [
      'GET /api/users/match - Find roommates',
      'DELETE /api/users/reset-profile - Reset profile data',
      'POST /api/users/upload-profile-picture - Upload profile picture',
      'PUT /api/users/profile - Update profile information',
      'GET /api/users/test - Test route'
    ],
    note: 'Profile picture upload is now available!'
  });
});

module.exports = router;
