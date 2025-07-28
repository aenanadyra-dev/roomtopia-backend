// ✅ SCRIPT TO ASSIGN DEFAULT PROFILE PICTURES AND SYNC TO ROOMMATE REQUESTS
// This script will assign default profile pictures to users who don't have any
// and then sync all profile pictures to roommate requests

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const RoommateRequest = require('../models/RoommateRequest');
const fs = require('fs');
const path = require('path');

async function assignDefaultProfilePictures() {
  try {
    console.log('🎨 Starting default profile picture assignment...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/roomtopia');
    console.log('✅ Connected to MongoDB');
    
    // Get available profile pictures
    const profilesDir = path.join(__dirname, '../uploads/profiles');
    const availablePictures = fs.readdirSync(profilesDir)
      .filter(file => file.startsWith('profile-') && (file.endsWith('.jpg') || file.endsWith('.png')))
      .map(file => `/uploads/profiles/${file}`);
    
    console.log(`📸 Found ${availablePictures.length} available profile pictures`);
    
    // Get all users without profile pictures
    const usersWithoutPictures = await User.find({
      $or: [
        { profilePicture: null },
        { profilePicture: { $exists: false } },
        { profilePicture: "" }
      ]
    });
    
    console.log(`👤 Found ${usersWithoutPictures.length} users without profile pictures`);
    
    let assignedCount = 0;
    
    // Assign random profile pictures to users without them
    for (let i = 0; i < usersWithoutPictures.length; i++) {
      const user = usersWithoutPictures[i];
      const randomPicture = availablePictures[i % availablePictures.length];
      
      await User.findByIdAndUpdate(user._id, {
        profilePicture: randomPicture
      });
      
      console.log(`🎨 Assigned ${randomPicture} to ${user.fullName || user.email}`);
      assignedCount++;
    }
    
    console.log(`\n✅ Assigned ${assignedCount} default profile pictures`);
    
    // Now sync all profile pictures to roommate requests
    console.log('\n🔄 Starting profile picture sync to roommate requests...');
    
    const allRoommateRequests = await RoommateRequest.find({});
    console.log(`📊 Found ${allRoommateRequests.length} roommate requests`);
    
    let syncedCount = 0;
    let alreadySynced = 0;
    let noUserFound = 0;
    
    for (const request of allRoommateRequests) {
      const user = await User.findOne({ email: request.userEmail });
      
      if (user && user.profilePicture) {
        if (request.profilePicture !== user.profilePicture) {
          await RoommateRequest.findByIdAndUpdate(request._id, {
            profilePicture: user.profilePicture
          });
          
          console.log(`🔄 Synced picture for ${request.name}`);
          syncedCount++;
        } else {
          alreadySynced++;
        }
      } else {
        console.log(`❌ No user found for ${request.name} (${request.userEmail})`);
        noUserFound++;
      }
    }
    
    console.log('\n🎉 COMPLETE PROFILE PICTURE SETUP FINISHED!');
    console.log(`🎨 Default pictures assigned: ${assignedCount}`);
    console.log(`🔄 Roommate requests synced: ${syncedCount}`);
    console.log(`✅ Already had correct pictures: ${alreadySynced}`);
    console.log(`❌ No user found: ${noUserFound}`);
    console.log(`📊 Total roommate requests: ${allRoommateRequests.length}`);
    
    // Close the database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

// Run the script
assignDefaultProfilePictures();
