const mongoose = require('mongoose');
const RoommateRequest = require('../models/RoommateRequest');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/roomtopia', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function updateReligionValues() {
  try {
    console.log('🔄 Starting religion value update...');
    
    // Update all roommate requests that have religion: "Muslim" to "Islam"
    const result = await RoommateRequest.updateMany(
      { religion: "Muslim" },
      { $set: { religion: "Islam" } }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} roommate requests from "Muslim" to "Islam"`);
    
    // Also update preferences.religion values
    const prefResult = await RoommateRequest.updateMany(
      { "preferences.religion": "Muslim Only" },
      { $set: { "preferences.religion": "Islam Only" } }
    );
    
    console.log(`✅ Updated ${prefResult.modifiedCount} preference records from "Muslim Only" to "Islam Only"`);
    
    // Show some sample records to verify
    const sampleRecords = await RoommateRequest.find({ religion: "Islam" }).limit(3);
    console.log('\n📋 Sample updated records:');
    sampleRecords.forEach(record => {
      console.log(`- ${record.name}: religion="${record.religion}", preferences.religion="${record.preferences?.religion || 'N/A'}"`);
    });
    
    console.log('\n🎉 Religion value update completed successfully!');
    
  } catch (error) {
    console.error('❌ Error updating religion values:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateReligionValues();
