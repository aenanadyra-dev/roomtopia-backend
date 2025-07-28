const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Try to import Property model, but handle gracefully if it doesn't exist
let Property;
try {
  Property = require('../models/Property');
} catch (error) {
  console.log('⚠️ Property model not found, using direct database queries');
}

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Simple Password Reset Route (No Email Required)
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    console.log('🔐 Password reset attempt for:', email);

    // Validation
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'User not found with this email address' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    console.log('✅ Password reset successful for:', email);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('❌ Password reset error:', error);
    res.status(500).json({ error: 'Server error during password reset' });
  }
});

// FIXED Register route - now handles fullName and matricNumber
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, matricNumber, role = 'student' } = req.body;

    console.log('📝 Registration attempt:', { fullName, email, matricNumber });

    // Validation
    if (!fullName || !email || !password || !matricNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { matricNumber }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email ? 'Email already exists' : 'Matric number already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      fullName,
      username: fullName, // Keep username for compatibility
      email,
      password: hashedPassword,
      matricNumber,
      role,
      dreamHomes: []
    });

    console.log('🔍 About to save user:', { fullName, email, matricNumber, role });

await user.save();

console.log('💾 User saved successfully to database!');


    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log('✅ User registered successfully:', fullName);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        matricNumber: user.matricNumber,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Update last login time
    try {
      console.log('🔄 Updating lastLogin for user:', user.email);

      // Use direct database update instead of the model method
      await User.findByIdAndUpdate(user._id, {
        lastLogin: new Date()
      });

      console.log('✅ LastLogin updated successfully');
    } catch (error) {
      console.error('❌ Error updating lastLogin:', error);
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log('✅ User logged in successfully:', user.fullName || user.username);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName || user.username,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get profile route
router.get('/profile', auth, async (req, res) => {
  try {
    console.log('📋 Getting profile for user:', req.user.userId);
    
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    console.log('✅ Profile found:', user.fullName || user.username);

    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

// Update profile route
router.put('/profile', auth, async (req, res) => {
  try {
    console.log('📝 Updating profile for user:', req.user.userId);
    console.log('📤 Update data:', req.body);

    const {
      fullName,
      contactInfo,
      address,
      gender,
      dob,
      university,
      course,
      year,
      faculty,
      bio,
      preferences
    } = req.body;

    // Find user and update
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        fullName,
        contactInfo,
        address,
        gender,
        dob,
        university,
        course,
        year,
        faculty,
        bio,
        preferences,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    console.log('✅ Profile updated successfully:', user.fullName);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: user
    });

  } catch (error) {
    console.error('❌ Error updating profile:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName || user.username,
        username: user.username,
        email: user.email,
        role: user.role,
        dreamHomesCount: user.dreamHomes ? user.dreamHomes.length : 0
      }
    });
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// DREAM HOMES ROUTES
// ==========================================

// Get user's dream homes with actual property data
router.get('/dream-homes', auth, async (req, res) => {
  try {
    console.log('📋 Fetching Dream Homes for user:', req.user.userId);
    
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Initialize dreamHomes array if it doesn't exist
    if (!user.dreamHomes || user.dreamHomes.length === 0) {
      return res.json({
        success: true,
        dreamHomes: [],
        count: 0,
        message: 'No dream homes saved yet'
      });
    }
    
    // Extract property IDs
    const propertyIds = user.dreamHomes.map(item => {
      // Handle both string and ObjectId formats
      return typeof item.propertyId === 'string' ? 
        new mongoose.Types.ObjectId(item.propertyId) : 
        item.propertyId;
    });
    
    console.log('🔍 Looking for properties with IDs:', propertyIds);
    
    // Query properties collection directly to avoid model issues
    const properties = await mongoose.connection.db
      .collection('properties')
      .find({ _id: { $in: propertyIds } })
      .toArray();
    
    console.log('🏠 Found', properties.length, 'properties in database');
    
    // Map dream homes with actual property data
    const dreamHomesWithPropertyData = user.dreamHomes.map(item => {
      const propertyIdString = item.propertyId.toString();
      const property = properties.find(p => p._id.toString() === propertyIdString);
      
      if (property) {
        return {
          propertyId: {
            _id: property._id,
            title: property.title || 'Untitled Property',
            location: property.location || 'Location not specified',
            price: property.price || 0,
            photos: property.photos || [],
            propertyType: property.propertyType || 'Unknown',
            bedrooms: property.bedrooms || 0,
            bathrooms: property.bathrooms || 0,
            description: property.description || ''
          },
          savedAt: item.savedAt || new Date()
        };
      } else {
        // Property not found in database
        return {
          propertyId: {
            _id: item.propertyId,
            title: 'Property No Longer Available',
            location: 'Unknown',
            price: 0,
            photos: [],
            propertyType: 'Unavailable',
            bedrooms: 0,
            bathrooms: 0,
            description: 'This property may have been removed or is no longer available.'
          },
          savedAt: item.savedAt || new Date()
        };
      }
    });
    
    console.log('✅ Returning', dreamHomesWithPropertyData.length, 'Dream Homes with property data');
    
    res.json({
      success: true,
      dreamHomes: dreamHomesWithPropertyData,
      count: dreamHomesWithPropertyData.length,
      message: `Found ${dreamHomesWithPropertyData.length} dream homes`
    });
    
  } catch (error) {
    console.error('❌ Get dream homes error:', error);
    res.status(500).json({ 
      error: 'Server error while fetching dream homes',
      details: error.message 
    });
  }
});

// Add property to dream homes
router.post('/dream-homes/:propertyId', auth, async (req, res) => {
  try {
    const { propertyId } = req.params;
    console.log('💖 Adding property to dream homes:', propertyId);

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Initialize dreamHomes array if it doesn't exist
    if (!user.dreamHomes) {
      user.dreamHomes = [];
    }

    // Check if property is already in dream homes
    const existingIndex = user.dreamHomes.findIndex(
      item => item.propertyId.toString() === propertyId
    );

    if (existingIndex !== -1) {
      return res.status(400).json({ 
        error: 'Property already in dream homes',
        alreadyExists: true 
      });
    }

    // Verify property exists in database
    const propertyExists = await mongoose.connection.db
      .collection('properties')
      .findOne({ _id: new mongoose.Types.ObjectId(propertyId) });

    if (!propertyExists) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Add to dream homes
    user.dreamHomes.push({
      propertyId: propertyId,
      savedAt: new Date()
    });

    await user.save();

    console.log('✅ Property added to dream homes successfully');

    res.json({
      success: true,
      message: 'Property added to dream homes',
      dreamHomesCount: user.dreamHomes.length
    });

  } catch (error) {
    console.error('❌ Add to dream homes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove property from dream homes
router.delete('/dream-homes/:propertyId', auth, async (req, res) => {
  try {
    const { propertyId } = req.params;
    console.log('💔 Removing property from dream homes:', propertyId);

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.dreamHomes) {
      return res.status(404).json({ error: 'Property not in dream homes' });
    }

    // Find and remove the property
    const initialLength = user.dreamHomes.length;
    user.dreamHomes = user.dreamHomes.filter(
      item => item.propertyId.toString() !== propertyId
    );

    if (user.dreamHomes.length === initialLength) {
      return res.status(404).json({ error: 'Property not found in dream homes' });
    }

    await user.save();

    console.log('✅ Property removed from dream homes successfully');

    res.json({
      success: true,
      message: 'Property removed from dream homes',
      dreamHomesCount: user.dreamHomes.length
    });

  } catch (error) {
    console.error('❌ Remove from dream homes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check if property is in user's dream homes
router.get('/dream-homes/check/:propertyId', auth, async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isInDreamHomes = user.dreamHomes && user.dreamHomes.some(
      item => item.propertyId.toString() === propertyId
    );

    res.json({
      success: true,
      isInDreamHomes,
      dreamHomesCount: user.dreamHomes ? user.dreamHomes.length : 0
    });

  } catch (error) {
    console.error('❌ Check dream homes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// UTILITY ROUTES
// ==========================================

// ==========================================
// ACCOUNT DELETION ROUTE
// ==========================================

// Delete account route
router.delete('/delete-account', auth, async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.userId;

    console.log('🗑️ Account deletion request for user:', userId);

    // Verify password first
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Delete related data from other collections
    try {
      // Delete user's property listings
      const Property = require('../models/Property');
      await Property.deleteMany({ userEmail: user.email });
      console.log('🏠 Deleted user properties');

      // Delete user's roommate requests
      const RoommateRequest = require('../models/RoommateRequest');
      await RoommateRequest.deleteMany({ userEmail: user.email });
      console.log('👥 Deleted user roommate requests');

      // Delete user's analytics data
      const Analytics = require('../models/Analytics');
      await Analytics.deleteMany({ userId: user.email });
      console.log('📊 Deleted user analytics data');

      // Remove user from other users' dream homes
      await User.updateMany(
        { 'dreamHomes.propertyId': { $exists: true } },
        { $pull: { dreamHomes: { propertyId: { $in: [] } } } }
      );
      console.log('💔 Cleaned up dream homes references');

    } catch (cleanupError) {
      console.error('⚠️ Error during data cleanup (continuing with user deletion):', cleanupError);
    }

    // Finally, delete the user account
    await User.findByIdAndDelete(userId);
    console.log('✅ User account deleted successfully');

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('❌ Account deletion error:', error);
    res.status(500).json({
      error: 'Server error during account deletion'
    });
  }
});

// Test route
router.get('/test', (req, res) => {
  res.json({
    message: '🦕 Auth routes working!',
    timestamp: new Date().toISOString(),
    routes: [
      'POST /register',
      'POST /login',
      'GET /me',
      'GET /profile',
      'PUT /profile',
      'GET /dream-homes',
      'POST /dream-homes/:propertyId',
      'DELETE /dream-homes/:propertyId',
      'GET /dream-homes/check/:propertyId',
      'DELETE /delete-account'
    ]
  });
});

module.exports = router;