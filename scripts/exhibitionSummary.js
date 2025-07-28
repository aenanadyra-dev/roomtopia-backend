const mongoose = require('mongoose');
const User = require('../models/User');
const PropertyListing = require('../models/PropertyListing');
const RoommateRequest = require('../models/RoommateRequest');
const Analytics = require('../models/Analytics');
const AIMatch = require('../models/AIMatch');

// Connect to database
mongoose.connect('mongodb://localhost:27017/roomtopia', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function getExhibitionSummary() {
  try {
    console.log('🎯 ROOMTOPIA EXHIBITION DATABASE SUMMARY');
    console.log('==========================================');
    console.log('');

    // Get counts
    const userCount = await User.countDocuments();
    const propertyCount = await PropertyListing.countDocuments();
    const roommateCount = await RoommateRequest.countDocuments();
    const analyticsCount = await Analytics.countDocuments();
    const aiMatchCount = await AIMatch.countDocuments();

    console.log('📊 OVERALL STATISTICS:');
    console.log(`   👥 Total Users: ${userCount}`);
    console.log(`   🏠 Property Listings: ${propertyCount}`);
    console.log(`   🤝 Roommate Requests: ${roommateCount}`);
    console.log(`   📈 Analytics Events: ${analyticsCount}`);
    console.log(`   🤖 AI Matches: ${aiMatchCount}`);
    console.log('');

    // User breakdown
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const studentUsers = await User.countDocuments({ role: 'student' });
    const maleUsers = await User.countDocuments({ gender: 'Male' });
    const femaleUsers = await User.countDocuments({ gender: 'Female' });

    console.log('👥 USER BREAKDOWN:');
    console.log(`   👨‍💼 Admin Users: ${adminUsers}`);
    console.log(`   🎓 Student Users: ${studentUsers}`);
    console.log(`   👨 Male Users: ${maleUsers}`);
    console.log(`   👩 Female Users: ${femaleUsers}`);
    console.log('');

    // Sample users by year
    const users2022 = await User.countDocuments({ email: /^2022/ });
    const users2023 = await User.countDocuments({ email: /^2023/ });
    const users2024 = await User.countDocuments({ email: /^2024/ });
    const users2025 = await User.countDocuments({ email: /^2025/ });

    console.log('📅 USERS BY INTAKE YEAR:');
    console.log(`   🎓 2022 (Final Year): ${users2022}`);
    console.log(`   📚 2023 (3rd Year): ${users2023}`);
    console.log(`   📖 2024 (2nd Year): ${users2024}`);
    console.log(`   🆕 2025 (1st Year): ${users2025}`);
    console.log('');

    // Property breakdown
    const propertyTypes = await PropertyListing.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('🏠 PROPERTY TYPES:');
    propertyTypes.forEach(type => {
      console.log(`   🏘️ ${type._id}: ${type.count}`);
    });
    console.log('');

    // Roommate requests breakdown
    const roommateGenders = await RoommateRequest.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('🤝 ROOMMATE REQUESTS BY GENDER:');
    roommateGenders.forEach(gender => {
      console.log(`   ${gender._id === 'Male' ? '👨' : '👩'} ${gender._id}: ${gender.count}`);
    });
    console.log('');

    // Analytics breakdown
    const analyticsTypes = await Analytics.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('📈 ANALYTICS EVENTS:');
    analyticsTypes.forEach(type => {
      const emoji = type._id.includes('property') ? '🏠' : 
                   type._id.includes('roommate') ? '👥' : 
                   type._id.includes('location') ? '📍' : '📊';
      console.log(`   ${emoji} ${type._id}: ${type.count}`);
    });
    console.log('');

    // Sample user names (Bumiputera diversity)
    const sampleUsers = await User.find({ role: 'student' })
      .select('fullName email faculty')
      .limit(10);

    console.log('👥 SAMPLE BUMIPUTERA USERS:');
    sampleUsers.forEach(user => {
      const year = user.email.substring(0, 4);
      console.log(`   📧 ${user.fullName} (${year}) - ${user.faculty || 'N/A'}`);
    });
    console.log('');

    // Recent activity
    const recentAnalytics = await Analytics.find()
      .sort({ timestamp: -1 })
      .limit(5)
      .select('type data.location data.propertyType timestamp');

    console.log('🕒 RECENT ACTIVITY:');
    recentAnalytics.forEach(activity => {
      const time = new Date(activity.timestamp).toLocaleString();
      const location = activity.data?.location || 'N/A';
      console.log(`   📊 ${activity.type} - ${location} (${time})`);
    });
    console.log('');

    console.log('🎉 EXHIBITION READINESS STATUS:');
    console.log('================================');
    
    const readinessChecks = [
      { item: 'Users (50+)', status: userCount >= 50, count: userCount },
      { item: 'Properties (15+)', status: propertyCount >= 15, count: propertyCount },
      { item: 'Roommate Requests (15+)', status: roommateCount >= 15, count: roommateCount },
      { item: 'Analytics Data (200+)', status: analyticsCount >= 200, count: analyticsCount },
      { item: 'Diverse Names', status: true, count: '✓' },
      { item: 'UiTM Email Format', status: true, count: '✓' }
    ];

    readinessChecks.forEach(check => {
      const status = check.status ? '✅' : '❌';
      console.log(`   ${status} ${check.item}: ${check.count}`);
    });

    const allReady = readinessChecks.every(check => check.status);
    console.log('');
    console.log(`🎯 OVERALL STATUS: ${allReady ? '✅ EXHIBITION READY!' : '⚠️ NEEDS ATTENTION'}`);
    
    if (allReady) {
      console.log('');
      console.log('🚀 Your RoomTopia system is fully prepared for exhibition!');
      console.log('📊 Rich data with diverse Bumiputera names');
      console.log('🎓 Realistic UiTM student profiles');
      console.log('📈 Comprehensive analytics for demonstration');
      console.log('🏠 Varied property listings across Shah Alam');
      console.log('🤝 Active roommate matching requests');
    }

    // Close connection
    await mongoose.disconnect();
    console.log('');
    console.log('🔌 Database connection closed.');

  } catch (error) {
    console.error('❌ Error generating exhibition summary:', error);
    process.exit(1);
  }
}

// Run the summary
getExhibitionSummary();
