const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/roomtopia');

async function createAICollections() {
  try {
    const db = mongoose.connection.db;
    
    // Create AI Matches collection
    console.log('🤖 Creating AI matches collection...');
    await db.createCollection('aimatches');
    
    // Create indexes for efficient AI matching
    await db.collection('aimatches').createIndex({ user1Id: 1, compatibilityScore: -1 });
    await db.collection('aimatches').createIndex({ user2Id: 1, compatibilityScore: -1 });
    await db.collection('aimatches').createIndex({ compatibilityScore: -1 });
    
    console.log('✅ AI matches collection created with indexes');
    
    // Update property listings for user ownership
    console.log('🏠 Updating property listings for user ownership...');
    await db.collection('propertylistings').updateMany(
      { userId: { $exists: false } },
      {
        $set: {
          userId: null,
          userEmail: null,
          source: 'Generated Data'
        }
      }
    );
    
    console.log('✅ Property listings updated for user ownership');
    
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error creating collections:', error);
  }
}

createAICollections();
