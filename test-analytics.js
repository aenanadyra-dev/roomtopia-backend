const mongoose = require('mongoose');
const RoommateRequest = require('./models/RoommateRequest');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/roomtopia', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function testAnalytics() {
  try {
    console.log('🔍 Testing roommate analytics...');
    
    // Get all roommate requests
    const allRequests = await RoommateRequest.find({}).select('name gender status');
    console.log('📊 ALL roommate requests in database:', allRequests);
    
    // Get gender distribution
    const genderPrefs = await RoommateRequest.aggregate([
      { 
        $match: { 
          gender: { $in: ['Male', 'Female'] }
        } 
      },
      { $group: { _id: '$gender', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('📈 Gender distribution:', genderPrefs);
    
    // Format for frontend
    const formatted = genderPrefs.map(item => ({
      name: item._id,
      count: item.count,
      value: 0
    }));
    
    const total = formatted.reduce((sum, item) => sum + item.count, 0);
    formatted.forEach(item => {
      item.value = total > 0 ? Math.round((item.count / total) * 100) : 0;
    });
    
    console.log('✅ Formatted result:', formatted);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testAnalytics();
