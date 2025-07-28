// controllers/userController.js
const User = require('../models/User');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // From auth middleware
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
      error: error.message
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // From auth middleware
    const profileData = req.body;

    console.log('Updating profile for user ID:', userId);
    console.log('Profile data:', profileData);

    // Find user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields that match your existing User model structure
    if (profileData.fullName !== undefined) user.fullName = profileData.fullName;
    if (profileData.contactInfo !== undefined) user.contactInfo = profileData.contactInfo;
    if (profileData.preferences !== undefined) user.preferences = profileData.preferences;
    
    // Handle additional profile fields if they exist in the request
    if (profileData.address !== undefined) user.address = profileData.address;
    if (profileData.gender !== undefined) user.gender = profileData.gender;
    if (profileData.dob !== undefined) user.dob = profileData.dob;
    if (profileData.university !== undefined) user.university = profileData.university;
    if (profileData.course !== undefined) user.course = profileData.course;
    if (profileData.year !== undefined) user.year = profileData.year;

    // Save user
    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: userResponse
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile',
      error: error.message
    });
  }
};

// Get all users for roommate matching
const getUsersForMatching = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { university, gender, preferences } = req.query;

    // Build filter query
    let filter = {
      _id: { $ne: currentUserId }, // Exclude current user
    };

    // Add filters based on query parameters
    if (university) filter.university = new RegExp(university, 'i');
    if (gender) filter.gender = gender;
    if (preferences) filter['preferences.lifestyle'] = new RegExp(preferences, 'i');

    const users = await User.find(filter)
      .select('-password') // Exclude password field
      .limit(50); // Limit results for performance

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users for matching:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
      error: error.message
    });
  }
};

// Reset user profile (keep essential info, clear profile data)
const resetProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Reset profile fields but keep essential data
    user.contactInfo = '';
    user.preferences = { lifestyle: '', tenantType: '' };
    
    // Reset additional fields if they exist
    if (user.address !== undefined) user.address = '';
    if (user.gender !== undefined) user.gender = '';
    if (user.dob !== undefined) user.dob = null;
    if (user.university !== undefined) user.university = '';
    if (user.course !== undefined) user.course = '';
    if (user.year !== undefined) user.year = '';

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile reset successfully'
    });
  } catch (error) {
    console.error('Error resetting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resetting profile',
      error: error.message
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getUsersForMatching,
  resetProfile
};