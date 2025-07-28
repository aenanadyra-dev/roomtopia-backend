const mongoose = require('mongoose');

// Connect to your existing database
mongoose.connect('mongodb://localhost:27017/roomtopia');

async function updateUsersForAI() {
  try {
    console.log('🦕 Updating users collection for AI matching...');
    
    // Get your existing users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Update all existing users to have AI roommate profile structure
    const result = await usersCollection.updateMany(
      { roommateProfile: { $exists: false } }, // Only update users without AI profile
      {
        $set: {
          roommateProfile: {
            age: null,
            gender: null,
            course: null,
            year: null,
            bio: null,
            interests: [],
            budgetMin: 300,
            budgetMax: 700,
            smoking: false,
            personalityVector: [],
            lifestylePreferences: {
              sleepSchedule: "flexible",
              cleanliness: 5,
              socialLevel: 5,
              studyHabits: "flexible",
              guestPolicy: "occasional"
            },
            compatibilityScores: []
          }
        }
      }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} users with AI profile structure`);
    
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error updating users:', error);
  }
}

updateUsersForAI();
