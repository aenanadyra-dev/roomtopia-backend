const mongoose = require('mongoose');
const Analytics = require('./models/Analytics');

async function testAnalyticsAPI() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/roomtopia', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Simulate the exact same logic as the API
    console.log('\n🔍 Testing analytics API logic...');

    // 1. REAL TOTAL SEARCHES (INCLUDING BOOKMARKS AS ENGAGEMENT)
    const totalSearches = await Analytics.countDocuments({
      type: { $in: ['property_search', 'roommate_search', 'location_search', 'property_bookmark'] }
    });
    console.log('🔍 DEBUG: Total searches count:', totalSearches);

    // 2. REAL TOP LOCATION - COMBINE SEARCHES AND BOOKMARKS FOR ACCURATE POPULARITY
    const locationSearches = await Analytics.aggregate([
      {
        $addFields: {
          normalizedLocation: {
            $cond: {
              if: { $eq: ['$type', 'location_search'] },
              then: '$data.searchTerm',
              else: '$data.location'
            }
          }
        }
      },
      { 
        $match: { 
          type: { $in: ['location_search', 'property_search', 'property_bookmark'] },
          normalizedLocation: { 
            $exists: true, 
            $ne: null, 
            $ne: '', 
            $ne: 'Any',
            $ne: 'Unknown',
            $ne: 'any',
            $ne: 'ALL',
            $ne: 'all',
            $type: 'string'
          }
        } 
      },
      { $group: { _id: '$normalizedLocation', count: { $sum: 1 } } },
      { 
        $match: { 
          '_id': { 
            $ne: null, 
            $ne: '', 
            $ne: 'Any',
            $ne: 'any',
            $ne: 'ALL',
            $ne: 'all',
            $type: 'string' 
          }
        }
      },
      { $sort: { count: -1, _id: 1 } },
      { $limit: 8 }
    ]);

    console.log('🔍 DEBUG: Location searches result:', locationSearches);

    // ✅ FILTER AND CALCULATE REAL LOCATION TOTAL
    const filteredLocationSearches = locationSearches.filter(item => 
      item._id && 
      item._id.trim() !== '' && 
      item._id !== 'Any' && 
      item._id !== 'any' && 
      item._id !== 'ALL' && 
      item._id !== 'all'
    );
    
    const locationTotalSearches = filteredLocationSearches.reduce((sum, item) => sum + item.count, 0);
    console.log('🔍 DEBUG: Filtered location total searches:', locationTotalSearches);

    const dashboardData = {
      totalSearches: locationTotalSearches || 0,
      trendingLocation: {
        name: filteredLocationSearches[0]?._id || "No searches yet",
        searches: filteredLocationSearches[0]?.count || 0,
        percentage: locationTotalSearches > 0 ? Math.round((filteredLocationSearches[0]?.count || 0) / locationTotalSearches * 100) : 0,
        trend: filteredLocationSearches[0]?.count > 0 ? `+${filteredLocationSearches[0]?.count} searches` : "No activity"
      },
      locationData: filteredLocationSearches.map(item => ({
        name: item._id,
        searches: item.count
      }))
    };

    console.log('\n✅ FINAL API RESPONSE:');
    console.log('📊 Total Searches:', dashboardData.totalSearches);
    console.log('🏆 Trending Location:', dashboardData.trendingLocation);
    console.log('📍 Location Data:');
    dashboardData.locationData.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.name}: ${item.searches} searches`);
    });

    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testAnalyticsAPI();
