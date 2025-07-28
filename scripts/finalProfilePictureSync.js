// ✅ FINAL SIMPLE PROFILE PICTURE SYNC
// This will sync ALL profile pictures from user accounts to roommate requests
// SIMPLE AND DIRECT - NO COMPLICATIONS!

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const RoommateRequest = require('../models/RoommateRequest');

async function finalSync() {
  try {
    console.log('🔄 Starting FINAL profile picture sync...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/roomtopia');
    console.log('✅ Connected to MongoDB');
    
    // Get ALL roommate requests
    const allRequests = await RoommateRequest.find({});
    console.log(`📊 Found ${allRequests.length} roommate requests`);
    
    let syncedCount = 0;
    let noUserFound = 0;
    let userHasNoPicture = 0;
    
    for (const request of allRequests) {
      console.log(`\n🔍 Processing: ${request.name} (${request.userEmail})`);
      
      // Find the user by email
      const user = await User.findOne({ email: request.userEmail });
      
      if (user) {
        if (user.profilePicture) {
          // User has a profile picture - sync it to roommate request
          await RoommateRequest.findByIdAndUpdate(request._id, {
            profilePicture: user.profilePicture
          });
          
          console.log(`✅ SYNCED: ${user.profilePicture}`);
          syncedCount++;
        } else {
          // User has no profile picture - remove any picture from roommate request
          await RoommateRequest.findByIdAndUpdate(request._id, {
            $unset: { profilePicture: 1 }
          });
          
          console.log(`🔤 NO PICTURE: Will show initials`);
          userHasNoPicture++;
        }
      } else {
        console.log(`❌ USER NOT FOUND`);
        noUserFound++;
      }
    }
    
    console.log('\n🎉 FINAL SYNC COMPLETED!');
    console.log(`✅ Pictures synced: ${syncedCount}`);
    console.log(`🔤 Will show initials: ${userHasNoPicture}`);
    console.log(`❌ User not found: ${noUserFound}`);
    console.log(`📊 Total processed: ${allRequests.length}`);
    
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
finalSync();
