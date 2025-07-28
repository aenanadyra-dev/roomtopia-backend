const mongoose = require('mongoose');
const User = require('../models/User');
const AIMatch = require('../models/AIMatch');
const PropertyListing = require('../models/PropertyListing');

mongoose.connect('mongodb://localhost:27017/roomtopia');

async function testMongoDB() {
  try {
    console.log('🦕 Testing MongoDB integration...');
    
    // Test 1: Check users collection
    const userCount = await User.countDocuments();
    console.log(`✅ Users in database: ${userCount}`);
    
    // Test 2: Check property listings
    const propertyCount = await PropertyListing.countDocuments();
    console.log(`✅ Properties in database: ${propertyCount}`);
    
    // Test 3: Check if AI matches collection exists
    const aiMatchCount = await AIMatch.countDocuments();
    console.log(`✅ AI matches in database: ${aiMatchCount}`);
    
    // Test 4: Sample user with roommate profile
    const sampleUser = await User.findOne();
    if (sampleUser) {
      console.log('✅ Sample user structure:', {
        name: sampleUser.fullName,
        hasRoommateProfile: !!sampleUser.roommateProfile,
        profileComplete: !!(sampleUser.roommateProfile?.age && sampleUser.roommateProfile?.bio)
      });
    }
    
    console.log('🎵 MongoDB integration test complete!');
    mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ MongoDB test failed:', error);
  }
}

testMongoDB();
