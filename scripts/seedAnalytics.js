const mongoose = require('mongoose');
const Analytics = require('../models/Analytics');

// Connect to database
mongoose.connect('mongodb://localhost:27017/roomtopia', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Generate analytics data for the past 30 days
const generateAnalyticsData = () => {
  const analyticsData = [];
  const now = new Date();
  
  // 🎯 REALISTIC 2025 UiTM STUDENT EMAILS - Valid matric numbers
  const userEmails = [
    // Final Year (2022 intake)
    '2022101234@student.uitm.edu.my',
    '2022115678@student.uitm.edu.my',
    '2022173456@student.uitm.edu.my',
    '2022175890@student.uitm.edu.my',
    '2022187234@student.uitm.edu.my',
    '2022327567@student.uitm.edu.my',
    // 3rd Year (2023 intake)
    '2023513890@student.uitm.edu.my',
    '2023866123@student.uitm.edu.my',
    '2023988456@student.uitm.edu.my',
    '2023019789@student.uitm.edu.my',
    '2023053012@student.uitm.edu.my',
    '2023164345@student.uitm.edu.my',
    '2023794678@student.uitm.edu.my',
    '2023932901@student.uitm.edu.my',
    // 2nd Year (2024 intake)
    '2024378234@student.uitm.edu.my',
    '2024575567@student.uitm.edu.my',
    '2024783890@student.uitm.edu.my',
    '2024282123@student.uitm.edu.my',
    '2024529456@student.uitm.edu.my',
    '2024970789@student.uitm.edu.my',
    '2024307012@student.uitm.edu.my',
    // 1st Year (2025 intake)
    '2025325345@student.uitm.edu.my',
    '2025615678@student.uitm.edu.my',
    '2025888901@student.uitm.edu.my',
    '2025012234@student.uitm.edu.my'
  ];

  const locations = [
    'Seksyen 1', 'Seksyen 2', 'Seksyen 6', 'Seksyen 7', 'Seksyen 8', 
    'Seksyen 9', 'Seksyen 10', 'Seksyen 13', 'Seksyen 24', 'Seksyen 25',
    'Ken Rimba', 'i-City', 'Setia Alam', 'Kota Kemuning', 'Seksyen U1', 'Seksyen U2', 'Seksyen U16'
  ];

  const propertyTypes = ['Single Room', 'Master Room', 'Shared Room', 'Studio', 'Apartment'];
  const genders = ['Male Only', 'Female Only', 'Any Gender'];

  // Generate data for the past 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate 5-15 analytics events per day
    const eventsPerDay = Math.floor(Math.random() * 11) + 5;
    
    for (let j = 0; j < eventsPerDay; j++) {
      const randomUser = userEmails[Math.floor(Math.random() * userEmails.length)];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      const randomPropertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const randomGender = genders[Math.floor(Math.random() * genders.length)];
      
      // Random event time during the day
      const eventTime = new Date(date);
      eventTime.setHours(Math.floor(Math.random() * 24));
      eventTime.setMinutes(Math.floor(Math.random() * 60));
      
      // Generate different types of analytics events
      const eventTypes = [
        {
          type: 'property_search',
          data: {
            location: randomLocation,
            minPrice: Math.floor(Math.random() * 500) + 300,
            maxPrice: Math.floor(Math.random() * 800) + 600,
            propertyType: randomPropertyType,
            preferredGender: randomGender,
            searchResultsCount: Math.floor(Math.random() * 20) + 5
          }
        },
        {
          type: 'roommate_search',
          data: {
            location: randomLocation,
            roommateGender: randomGender,
            budgetMin: Math.floor(Math.random() * 400) + 300,
            budgetMax: Math.floor(Math.random() * 500) + 600,
            lifestyle: ['Quiet/Studious', 'Social/Active', 'Balanced'][Math.floor(Math.random() * 3)],
            searchResultsCount: Math.floor(Math.random() * 15) + 3
          }
        },
        {
          type: 'location_search',
          data: {
            searchTerm: randomLocation,
            resultType: 'properties',
            resultsFound: Math.floor(Math.random() * 25) + 5
          }
        },
        {
          type: 'property_bookmark',
          data: {
            propertyId: `prop_${Math.random().toString(36).substr(2, 9)}`,
            location: randomLocation,
            price: Math.floor(Math.random() * 800) + 400,
            propertyType: randomPropertyType
          }
        },
        {
          type: 'roommate_view',
          data: {
            roommateId: `roommate_${Math.random().toString(36).substr(2, 9)}`,
            viewerGender: randomGender,
            roommateGender: randomGender,
            matchPercentage: Math.floor(Math.random() * 40) + 60
          }
        }
      ];
      
      const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      analyticsData.push({
        userId: randomUser,
        type: randomEvent.type,
        data: randomEvent.data,
        timestamp: eventTime,
        source: 'Exhibition Demo Data'
      });
    }
  }
  
  return analyticsData;
};

async function seedAnalytics() {
  try {
    console.log('📊 Starting analytics seeding...');
    
    // Clear existing demo analytics
    await Analytics.deleteMany({ source: 'Exhibition Demo Data' });
    console.log('🗑️ Cleared existing demo analytics');
    
    // Generate and insert analytics data
    const analyticsData = generateAnalyticsData();
    const result = await Analytics.insertMany(analyticsData);
    
    console.log(`✅ Successfully inserted ${result.length} analytics events!`);
    console.log('📊 Analytics data includes:');
    console.log('   - Property searches with filters');
    console.log('   - Roommate searches and matching');
    console.log('   - Location-based searches');
    console.log('   - Property bookmarks and favorites');
    console.log('   - Roommate profile views');
    console.log('   - 30 days of realistic user activity');
    
    // Generate summary statistics
    const propertySearches = result.filter(r => r.type === 'property_search').length;
    const roommateSearches = result.filter(r => r.type === 'roommate_search').length;
    const locationSearches = result.filter(r => r.type === 'location_search').length;
    const bookmarks = result.filter(r => r.type === 'property_bookmark').length;
    const roommateViews = result.filter(r => r.type === 'roommate_view').length;
    
    console.log('\n📈 Event breakdown:');
    console.log(`   🏠 Property searches: ${propertySearches}`);
    console.log(`   👥 Roommate searches: ${roommateSearches}`);
    console.log(`   📍 Location searches: ${locationSearches}`);
    console.log(`   ⭐ Property bookmarks: ${bookmarks}`);
    console.log(`   👀 Roommate views: ${roommateViews}`);
    
    // Close connection
    await mongoose.disconnect();
    console.log('🔌 Database connection closed.');
    
  } catch (error) {
    console.error('❌ Error seeding analytics:', error);
    process.exit(1);
  }
}

// Run the seeding
seedAnalytics();
