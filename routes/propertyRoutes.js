const express = require('express');
const PropertyListing = require('../models/PropertyListing');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Ensure upload directory exists (NEW - prevents upload errors)
const uploadDir = 'uploads/properties';
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads (IMPROVED - better error handling)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('📁 Setting destination to:', uploadDir);
    cb(null, 'uploads/properties/');
  },
  filename: function (req, file, cb) {
    // Create unique filename: timestamp-originalname
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    console.log('📝 Generated filename:', uniqueName);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // IMPROVED - 10MB limit (was 5MB)
    files: 5 // NEW - explicit file count limit
  },
  fileFilter: function (req, file, cb) {
    console.log('🔍 Checking file:', file.originalname, 'Type:', file.mimetype);
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      console.log('✅ File type accepted');
      cb(null, true);
    } else {
      console.log('❌ File type rejected');
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Photo upload endpoint (IMPROVED - better error handling)
router.post('/upload-photos', (req, res) => {
  console.log('📸 Photo upload request received');
  
  const uploadMiddleware = upload.array('photos', 5);
  
  uploadMiddleware(req, res, function (err) {
    if (err) {
      console.error('🦕 Upload error:', err.message);
      
      // IMPROVED - specific error handling for different Multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            error: 'File too large. Maximum size is 10MB per photo.'
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            error: 'Too many files. Maximum 5 photos allowed.'
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            success: false,
            error: 'Unexpected field name. Use "photos" as field name.'
          });
        }
      }
      
      return res.status(400).json({
        success: false,
        error: err.message || 'Failed to upload photos'
      });
    }

    // Your original validation logic (KEPT)
    if (!req.files || req.files.length === 0) {
      console.log('❌ No files received');
      return res.status(400).json({
        success: false,
        error: 'No photos uploaded'
      });
    }

    // Your original photo URL mapping (KEPT)
    const photoUrls = req.files.map(file => ({
      url: `/uploads/properties/${file.filename}`,
      filename: file.originalname,
      size: file.size
    }));

    console.log(`📸 Uploaded ${photoUrls.length} photos`);

    // Your original response (KEPT)
    res.json({
      success: true,
      photos: photoUrls,
      message: `Successfully uploaded ${photoUrls.length} photos!`
    });
  });
});

// ✅ FIXED GET ROUTE - NOW INCLUDES EDITED PROPERTIES
router.get('/', async (req, res) => {
  try {
    console.log('🦕 Fetching user-generated properties...');
    
    const { location, minPrice, maxPrice, type } = req.query;
    
    let filter = {
      isActive: true,
      source: { $in: ['User Submission', 'Edit Submission', 'Exhibition Demo Data'] } // ✅ INCLUDES EXHIBITION DATA
    };
    
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    if (type) filter.type = type;
    
    const listings = await PropertyListing.find(filter)
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: listings.length,
      data: listings,
      message: '🏠 User-generated properties with photos!'
    });
    
  } catch (error) {
    console.error('🦕 Error fetching properties:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error fetching properties: ' + error.message
    });
  }
});

// User submits their own property WITH PHOTOS - YOUR ORIGINAL CODE KEPT
router.post('/user-submit', async (req, res) => {
  try {
    console.log('🏠 User submitting property with photos...');
    
    const { userEmail } = req.body;
    
    // Find the user first
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Create property with user ownership and photos
    const propertyData = {
      ...req.body,
      userId: user._id,
      userEmail: userEmail,
      source: 'User Submission'
    };
    
    const newProperty = new PropertyListing(propertyData);
    const savedProperty = await newProperty.save();
    
    console.log(`🎵 Property with photos saved by ${user.fullName}:`, savedProperty.title);
    
    res.json({
      success: true,
      message: 'Property posted successfully with photos!',
      data: savedProperty
    });
    
  } catch (error) {
    console.error('🦕 Error saving property:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save property: ' + error.message
    });
  }
});

// ✅ FIXED UPDATE ROUTE
router.put('/:id', async (req, res) => {
  try {
    console.log('✏️ Edit request received for property:', req.params.id);
    console.log('✏️ Request body:', req.body);
    
    const { id } = req.params;
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ 
        success: false, 
        error: 'User email is required' 
      });
    }

    const listing = await PropertyListing.findById(id);
    if (!listing) {
      return res.status(404).json({ 
        success: false, 
        error: 'Property not found' 
      });
    }

    console.log('✏️ Property owner:', listing.userEmail);
    console.log('✏️ Requesting user:', userEmail);

    if (listing.userEmail !== userEmail) {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized to edit this property' 
      });
    }

    // Update the property with new data
    const updateData = { ...req.body };
    delete updateData.userEmail; // Don't update userEmail
    updateData.updatedAt = new Date();
    updateData.source = 'Edit Submission'; // ✅ KEEP THIS - GET ROUTE NOW HANDLES IT

    const updatedProperty = await PropertyListing.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    console.log('✅ Property updated successfully:', {
      id: updatedProperty._id,
      title: updatedProperty.title,
      source: updatedProperty.source
    });
    
    res.json({ 
      success: true, 
      message: 'Property updated successfully',
      data: updatedProperty
    });
    
  } catch (error) {
    console.error('❌ Edit error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get user's own properties - YOUR ORIGINAL CODE KEPT
router.get('/my-properties', async (req, res) => {
  try {
    const { userEmail } = req.query;
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        error: 'User email required'
      });
    }
    
    const myProperties = await PropertyListing.find({ 
      userEmail: userEmail,
      isActive: true 
    })
    .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: myProperties.length,
      data: myProperties,
      message: `Your ${myProperties.length} properties`
    });
    
  } catch (error) {
    console.error('🦕 Error fetching user properties:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch your properties'
    });
  }
});

// DELETE a property listing (only by owner) - FIXED PLACEMENT
router.delete('/:id', async (req, res) => {
  try {
    console.log('🗑️ Delete request received for property:', req.params.id);
    console.log('🗑️ Request body:', req.body);
    
    const { id } = req.params;
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ 
        success: false, 
        error: 'User email is required' 
      });
    }

    const listing = await PropertyListing.findById(id);
    if (!listing) {
      return res.status(404).json({ 
        success: false, 
        error: 'Property not found' 
      });
    }

    console.log('🗑️ Property owner:', listing.userEmail);
    console.log('🗑️ Requesting user:', userEmail);

    if (listing.userEmail !== userEmail) {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized to delete this property' 
      });
    }

    await PropertyListing.findByIdAndDelete(id);
    
    console.log('✅ Property deleted successfully');
    
    res.json({ 
      success: true, 
      message: 'Property deleted successfully' 
    });
    
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});


router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: '🦕 Property routes with photo upload are working super-dee-duper!',
    timestamp: new Date(),
    uploadDir: uploadDir,
    routes: [
      'GET /',
      'POST /user-submit',
      'PUT /:id',
      'DELETE /:id',
      'GET /my-properties',
      'POST /upload-photos'
    ]
  });
});

module.exports = router;
