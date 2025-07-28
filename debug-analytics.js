const mongoose = require('mongoose');
const Analytics = require('./models/Analytics');

async function debugAnalytics() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/roomtopia', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check total count
    const totalCount = await Analytics.countDocuments();
    console.log('📊 Total analytics records:', totalCount);

    // Check location_search records
    const locationSearches = await Analytics.find({ type: 'location_search' }).limit(5);
    console.log('🔍 Sample location_search records:');
    locationSearches.forEach(record => {
      console.log('  -', record.data);
    });

    // Check property_search records
    const propertySearches = await Analytics.find({ type: 'property_search' }).limit(5);
    console.log('🏠 Sample property_search records:');
    propertySearches.forEach(record => {
      console.log('  -', record.data);
    });

    // Check property_bookmark records
    const propertyBookmarks = await Analytics.find({ type: 'property_bookmark' }).limit(5);
    console.log('⭐ Sample property_bookmark records:');
    propertyBookmarks.forEach(record => {
      console.log('  -', record.data);
    });

    // Test the aggregation query
    console.log('\n🔍 Testing location aggregation...');
    const locationAgg = await Analytics.aggregate([
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

    console.log('📍 Location aggregation results:');
    locationAgg.forEach(result => {
      console.log(`  - "${result._id}": ${result.count} searches`);
    });

    // Filter out unwanted values
    const filteredResults = locationAgg.filter(result =>
      result._id &&
      result._id.trim() !== '' &&
      result._id !== 'Any' &&
      result._id !== 'any' &&
      result._id !== 'ALL' &&
      result._id !== 'all'
    );

    console.log('\n📍 Filtered location results:');
    filteredResults.forEach(result => {
      console.log(`  - "${result._id}": ${result.count} searches`);
    });

    await mongoose.connection.close();
    console.log('🔌 Database connection closed');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

debugAnalytics();
