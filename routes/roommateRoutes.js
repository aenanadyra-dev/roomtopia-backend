const express = require('express');
const RoommateRequest = require('../models/RoommateRequest');
const User = require('../models/User'); // Add User model for sync functionality
const router = express.Router();

// Get all roommate requests (with optional filters) - AUTO-FETCH PROFILE PICTURES
router.get('/', async (req, res) => {
  try {
    const { status, location, gender, minBudget, maxBudget } = req.query;

    // Build filter object
    let filter = {};
    if (status && status !== 'all') filter.status = status;
    if (location) filter.location = location;
    if (gender) filter['preferences.gender'] = gender;
    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = parseInt(minBudget);
      if (maxBudget) filter.budget.$lte = parseInt(maxBudget);
    }

    const requests = await RoommateRequest.find(filter)
      .sort({ createdAt: -1 })
      .select('-__v'); // Exclude __v

    // 🚀 AUTO-FETCH PROFILE PICTURES FROM USER ACCOUNTS
    const requestsWithProfilePictures = await Promise.all(
      requests.map(async (request) => {
        try {
          // Find the user by email to get their current profile picture
          const user = await User.findOne({ email: request.userEmail });

          // Convert to plain object and add current profile picture
          const requestObj = request.toObject();
          requestObj.profilePicture = user?.profilePicture || null;

          return requestObj;
        } catch (error) {
          console.error(`Error fetching profile picture for ${request.userEmail}:`, error);
          // Return original request if error
          return request.toObject();
        }
      })
    );

    res.json({
      success: true,
      count: requestsWithProfilePictures.length,
      data: requestsWithProfilePictures
    });
  } catch (error) {
    console.error('Error fetching roommate requests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch roommate requests'
    });
  }
});

// Create new roommate request
router.post('/', async (req, res) => {
  try {
    console.log('📝 Creating new roommate request:', req.body);

    const {
      name, age, gender, religion, contact,
      university, faculty, year,
      location, roomType, moveInDate, budget,
      preferences, aboutMe, interests, userEmail, userId,
      profilePicture, // ✅ NEW: Profile picture from user profile
      // Additional fields from frontend
      description, lifestyle, cleanliness, smokingPreference,
      studyHabits, socialLevel
    } = req.body;

    // Check if user already has a roommate request
    const existingRequest = await RoommateRequest.findOne({ userEmail });
    if (existingRequest) {
      return res.status(400).json({
        success: false,
        error: 'You already have an active roommate request. Please edit your existing request instead.'
      });
    }

    const newRequest = new RoommateRequest({
      // Personal Information
      name,
      age,
      gender,
      religion,
      contact,

      // Academic Information
      university: university || 'UiTM Shah Alam',
      faculty,
      year,

      // Accommodation Preferences (if provided)
      location,
      roomType,
      moveInDate: moveInDate ? new Date(moveInDate) : null,
      budget,

      // Frontend compatibility fields
      description: description || (aboutMe && aboutMe.description),
      lifestyle,
      cleanliness: cleanliness || (aboutMe && aboutMe.cleanliness),
      smokingPreference,
      studyHabits: studyHabits || (aboutMe && aboutMe.studyHabits),
      socialLevel: socialLevel || (aboutMe && aboutMe.socialLevel),

      // Preferences (nested structure)
      preferences: preferences ? {
        gender: preferences.gender,
        religion: preferences.religion,
        habits: preferences.habits || [],
        cleanliness: preferences.cleanliness,
        socialLevel: preferences.socialLevel,
        smoker: preferences.smoker,
        studyHabits: preferences.studyHabits
      } : {},

      // About Me (nested structure)
      aboutMe: aboutMe ? {
        description: aboutMe.description,
        studyHabits: aboutMe.studyHabits,
        cleanliness: aboutMe.cleanliness,
        socialLevel: aboutMe.socialLevel,
        smoker: aboutMe.smoker
      } : {},

      // Interests
      interests: interests || [],

      // ✅ PROFILE PICTURE FROM USER PROFILE
      profilePicture: profilePicture || null,

      // System
      userEmail,
      userId
    });

    const savedRequest = await newRequest.save();
    console.log('✅ Roommate request created successfully:', savedRequest._id);

    // 📊 TRACK ANALYTICS FOR NEW ROOMMATE POST
    try {
      const Analytics = require('../models/Analytics');
      const analyticsData = new Analytics({
        type: 'roommate_post_created',
        data: {
          gender: savedRequest.gender,
          location: savedRequest.location,
          budget: savedRequest.budget,
          university: savedRequest.university,
          userEmail: savedRequest.userEmail,
          timestamp: new Date().toISOString()
        },
        userId: savedRequest.userEmail,
        timestamp: new Date()
      });

      await analyticsData.save();
      console.log('📊 Analytics tracked for new roommate post:', savedRequest.gender);
    } catch (analyticsError) {
      console.log('⚠️ Analytics tracking failed (non-critical):', analyticsError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Roommate request posted successfully!',
      data: savedRequest
    });
  } catch (error) {
    console.error('❌ Error creating roommate request:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create roommate request'
    });
  }
});

// 🆕 UPDATE/EDIT a roommate request (FIXED - uses userEmail)
router.put('/:id', async (req, res) => {
  try {
    console.log('✏️ Edit request received for roommate:', req.params.id);
    console.log('✏️ Request body:', req.body);
    
    const { id } = req.params;
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ 
        success: false, 
        error: 'User email is required' 
      });
    }

    const request = await RoommateRequest.findById(id);
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        error: 'Roommate request not found' 
      });
    }

    console.log('✏️ Request owner:', request.userEmail);
    console.log('✏️ Requesting user:', userEmail);

    if (request.userEmail !== userEmail) {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized to edit this roommate request' 
      });
    }

    // Update the request with new data
    const updateData = { ...req.body };
    delete updateData.userEmail; // Don't update userEmail
    updateData.updatedAt = new Date();

    const updatedRequest = await RoommateRequest.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    console.log('✅ Roommate request updated successfully');
    
    res.json({ 
      success: true, 
      message: 'Roommate request updated successfully',
      data: updatedRequest
    });
    
  } catch (error) {
    console.error('❌ Edit error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// 🔥 DELETE a roommate request (FIXED - uses userEmail instead of userId)
router.delete('/:id', async (req, res) => {
  try {
    console.log('🗑️ Delete request received for roommate:', req.params.id);
    console.log('🗑️ Request body:', req.body);
    
    const { id } = req.params;
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ 
        success: false, 
        error: 'User email is required' 
      });
    }

    const request = await RoommateRequest.findById(id);
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        error: 'Roommate request not found' 
      });
    }

    console.log('🗑️ Request owner:', request.userEmail);
    console.log('🗑️ Requesting user:', userEmail);

    if (request.userEmail !== userEmail) {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized to delete this roommate request' 
      });
    }

    // 📊 TRACK ANALYTICS FOR DELETED ROOMMATE POST
    try {
      const Analytics = require('../models/Analytics');
      const analyticsData = new Analytics({
        type: 'roommate_post_deleted',
        data: {
          gender: request.gender,
          location: request.location,
          userEmail: request.userEmail,
          timestamp: new Date().toISOString()
        },
        userId: request.userEmail,
        timestamp: new Date()
      });

      await analyticsData.save();
      console.log('📊 Analytics tracked for deleted roommate post:', request.gender);
    } catch (analyticsError) {
      console.log('⚠️ Analytics tracking failed (non-critical):', analyticsError.message);
    }

    await RoommateRequest.findByIdAndDelete(id);

    console.log('✅ Roommate request deleted successfully');

    res.json({
      success: true,
      message: 'Roommate request deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// 🆕 Get user's own roommate request - AUTO-FETCH PROFILE PICTURE
router.get('/my-request', async (req, res) => {
  try {
    const { userEmail } = req.query;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        error: 'User email required'
      });
    }

    const myRequest = await RoommateRequest.findOne({
      userEmail: userEmail
    });

    // 🚀 AUTO-FETCH PROFILE PICTURE FROM USER ACCOUNT
    let requestWithProfilePicture = myRequest;
    if (myRequest) {
      try {
        const user = await User.findOne({ email: userEmail });
        requestWithProfilePicture = myRequest.toObject();
        requestWithProfilePicture.profilePicture = user?.profilePicture || null;
      } catch (error) {
        console.error(`Error fetching profile picture for ${userEmail}:`, error);
        requestWithProfilePicture = myRequest.toObject();
      }
    }

    res.json({
      success: true,
      data: requestWithProfilePicture,
      message: myRequest ? 'Your roommate request found' : 'No active request found'
    });

  } catch (error) {
    console.error('🔍 Error fetching user request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch your roommate request'
    });
  }
});

// ✅ SYNC PROFILE PICTURES TO EXISTING ROOMMATE REQUESTS
router.post('/sync-profile-pictures', async (req, res) => {
  try {
    console.log('🔄 Starting profile picture sync for existing roommate requests...');

    // Import User model at the top of the function to avoid issues
    const User = require('../models/User');

    // First, let's check if we can connect to the database
    console.log('📊 Checking database connection...');

    // Get all roommate requests that don't have profile pictures
    const roommateRequests = await RoommateRequest.find({
      $or: [
        { profilePicture: null },
        { profilePicture: { $exists: false } },
        { profilePicture: "" }
      ]
    });

    console.log(`📊 Found ${roommateRequests.length} roommate requests without profile pictures`);

    if (roommateRequests.length === 0) {
      return res.json({
        success: true,
        message: 'All roommate requests already have profile pictures!',
        updated: 0,
        total: 0
      });
    }

    let updatedCount = 0;
    let errorCount = 0;

    for (const request of roommateRequests) {
      try {
        console.log(`🔍 Processing ${request.name} (${request.userEmail})`);

        // Find the user by email
        const user = await User.findOne({ email: request.userEmail });

        if (user && user.profilePicture) {
          // Update the roommate request with the user's profile picture
          await RoommateRequest.findByIdAndUpdate(request._id, {
            profilePicture: user.profilePicture
          });

          console.log(`✅ Updated profile picture for ${request.name} (${request.userEmail})`);
          updatedCount++;
        } else if (user) {
          console.log(`⚠️ User found but no profile picture for ${request.name} (${request.userEmail})`);
        } else {
          console.log(`⚠️ No user found for ${request.name} (${request.userEmail})`);
        }
      } catch (error) {
        console.error(`❌ Error updating ${request.name}:`, error);
        errorCount++;
      }
    }

    const message = `Profile picture sync completed! Updated ${updatedCount} out of ${roommateRequests.length} requests.${errorCount > 0 ? ` (${errorCount} errors)` : ''}`;

    res.json({
      success: true,
      message: message,
      updated: updatedCount,
      total: roommateRequests.length,
      errors: errorCount
    });

  } catch (error) {
    console.error('❌ Profile picture sync error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync profile pictures',
      details: error.message
    });
  }
});

// Test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: '🏠 Roommate routes are working perfectly!',
    timestamp: new Date(),
    routes: [
      'GET /',
      'POST /',
      'PUT /:id',
      'DELETE /:id',
      'GET /my-request',
      'POST /sync-profile-pictures'
    ]
  });
});

module.exports = router;
