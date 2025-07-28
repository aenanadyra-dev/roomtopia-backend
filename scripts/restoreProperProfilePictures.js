// ✅ SCRIPT TO RESTORE PROPER PROFILE PICTURE BEHAVIOR
// This script will:
// 1. Keep only REAL uploaded profile pictures
// 2. Remove default assigned pictures from users who didn't upload any
// 3. Let the frontend show initials for users without pictures

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const RoommateRequest = require('../models/RoommateRequest');

// List of REAL profile pictures that users actually uploaded (before we messed with defaults)
const REAL_UPLOADED_PICTURES = [
  '/uploads/profiles/profile-1753542332114-863194886.jpg',  // Omar Idham
  '/uploads/profiles/profile-1753543058875-379477174.jpg',  // Tuah Hikashi
  '/uploads/profiles/profile-1753544273300-716018189.jpg',  // Kejora Alaya
  '/uploads/profiles/profile-1753548093538-141886622.jpg',  // Daneera Bintang
  '/uploads/profiles/profile-1753549008690-729323224.jpg',  // Qalish Raysh
  '/uploads/profiles/profile-1753555237920-532418499.jpg',  // Zainab Zulia
  '/uploads/profiles/profile-1753556315141-155283609.jpg',  // Yusof Rahman
  '/uploads/profiles/profile-1753550006685-73292497.jpg',   // Erfan Eskandar
  '/uploads/profiles/profile-1753560610153-899465357.jpg'   // Qistina Amira
];

async function restoreProperProfilePictures() {
  try {
    console.log('🔧 Starting profile picture restoration...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/roomtopia');
    console.log('✅ Connected to MongoDB');
    
    // Step 1: Remove default assigned pictures from users
    console.log('\n🧹 Step 1: Cleaning up default assigned pictures from users...');
    
    const allUsers = await User.find({ profilePicture: { $exists: true, $ne: null } });
    let cleanedUsers = 0;
    
    for (const user of allUsers) {
      if (user.profilePicture && !REAL_UPLOADED_PICTURES.includes(user.profilePicture)) {
        // This is a default assigned picture, remove it
        await User.findByIdAndUpdate(user._id, {
          $unset: { profilePicture: 1 }
        });
        
        console.log(`🧹 Removed default picture from ${user.fullName || user.email}`);
        cleanedUsers++;
      } else if (user.profilePicture && REAL_UPLOADED_PICTURES.includes(user.profilePicture)) {
        console.log(`✅ Keeping real picture for ${user.fullName || user.email}`);
      }
    }
    
    console.log(`\n✅ Cleaned ${cleanedUsers} users with default pictures`);
    
    // Step 2: Update roommate requests to only have real pictures
    console.log('\n🔄 Step 2: Updating roommate requests...');
    
    const allRoommateRequests = await RoommateRequest.find({});
    let updatedRequests = 0;
    let removedDefaultPictures = 0;
    
    for (const request of allRoommateRequests) {
      const user = await User.findOne({ email: request.userEmail });
      
      if (user && user.profilePicture && REAL_UPLOADED_PICTURES.includes(user.profilePicture)) {
        // User has a real uploaded picture, sync it
        if (request.profilePicture !== user.profilePicture) {
          await RoommateRequest.findByIdAndUpdate(request._id, {
            profilePicture: user.profilePicture
          });
          
          console.log(`✅ Synced real picture for ${request.name}`);
          updatedRequests++;
        }
      } else {
        // User doesn't have a real picture, remove any picture from roommate request
        if (request.profilePicture) {
          await RoommateRequest.findByIdAndUpdate(request._id, {
            $unset: { profilePicture: 1 }
          });
          
          console.log(`🧹 Removed picture from ${request.name} (will show initials)`);
          removedDefaultPictures++;
        }
      }
    }
    
    console.log('\n🎉 RESTORATION COMPLETED!');
    console.log(`✅ Real pictures synced: ${updatedRequests}`);
    console.log(`🧹 Default pictures removed: ${removedDefaultPictures}`);
    console.log(`📊 Total roommate requests: ${allRoommateRequests.length}`);
    console.log('\n💡 Users without pictures will now show their initials in the frontend!');
    
    // Close the database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Restoration failed:', error);
    process.exit(1);
  }
}

// Run the restoration
restoreProperProfilePictures();
