// ✅ IMPROVED STANDALONE SCRIPT TO SYNC PROFILE PICTURES
// Run this script to sync profile pictures from user accounts to roommate requests

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const RoommateRequest = require('../models/RoommateRequest');

async function syncProfilePictures() {
  try {
    console.log('🔄 Starting IMPROVED profile picture sync...');

    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/roomtopia');
    console.log('✅ Connected to MongoDB');

    // Get ALL roommate requests (not just ones without pictures)
    const allRoommateRequests = await RoommateRequest.find({});
    console.log(`📊 Found ${allRoommateRequests.length} total roommate requests`);

    let updatedCount = 0;
    let alreadyHadPictures = 0;
    let noUserFound = 0;
    let userHasNoPicture = 0;
    let errorCount = 0;

    for (const request of allRoommateRequests) {
      try {
        console.log(`🔍 Processing ${request.name} (${request.userEmail})`);

        // Find the user by email
        const user = await User.findOne({ email: request.userEmail });

        if (user && user.profilePicture) {
          // Check if roommate request already has the same picture
          if (request.profilePicture === user.profilePicture) {
            console.log(`✅ ${request.name} already has correct profile picture`);
            alreadyHadPictures++;
          } else {
            // Update the roommate request with the user's profile picture
            await RoommateRequest.findByIdAndUpdate(request._id, {
              profilePicture: user.profilePicture
            });

            console.log(`🔄 Updated profile picture for ${request.name} (${request.userEmail})`);
            console.log(`   Old: ${request.profilePicture || 'none'}`);
            console.log(`   New: ${user.profilePicture}`);
            updatedCount++;
          }
        } else if (user) {
          console.log(`⚠️ User found but no profile picture for ${request.name} (${request.userEmail})`);
          userHasNoPicture++;
        } else {
          console.log(`❌ No user found for ${request.name} (${request.userEmail})`);
          noUserFound++;
        }
      } catch (error) {
        console.error(`❌ Error updating ${request.name}:`, error);
        errorCount++;
      }
    }

    console.log('\n🎉 IMPROVED SYNC COMPLETED!');
    console.log(`🔄 Updated: ${updatedCount} roommate requests`);
    console.log(`✅ Already had pictures: ${alreadyHadPictures}`);
    console.log(`⚠️ User has no picture: ${userHasNoPicture}`);
    console.log(`❌ User not found: ${noUserFound}`);
    console.log(`💥 Errors: ${errorCount}`);
    console.log(`📊 Total processed: ${allRoommateRequests.length}`);

    // Close the database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');

    process.exit(0);

  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

// Run the sync
syncProfilePictures();
