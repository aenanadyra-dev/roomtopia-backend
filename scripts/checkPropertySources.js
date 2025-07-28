const mongoose = require('mongoose');
const PropertyListing = require('../models/PropertyListing');

// Connect to database
mongoose.connect('mongodb://localhost:27017/roomtopia', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function checkPropertySources() {
  try {
    console.log('🔍 Checking property sources in database...');
    
    // Get all properties with their sources
    const properties = await PropertyListing.find({}).select('title source').limit(10);
    console.log('📊 Sample properties and their sources:');
    properties.forEach(prop => {
      console.log(`  - ${prop.title} | Source: "${prop.source}"`);
    });
    
    // Get source breakdown
    const sourceCounts = await PropertyListing.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📈 Source breakdown:');
    sourceCounts.forEach(s => {
      console.log(`  - "${s._id}": ${s.count} properties`);
    });
    
    // Check what the API filter is looking for
    console.log('\n🔍 Current API filter looks for sources:');
    console.log('  - "User Submission"');
    console.log('  - "Edit Submission"');
    
    // Check if any properties match the current filter
    const apiFilteredProperties = await PropertyListing.find({
      isActive: true,
      source: { $in: ['User Submission', 'Edit Submission'] }
    }).countDocuments();
    
    console.log(`\n📊 Properties matching current API filter: ${apiFilteredProperties}`);
    
    // Total properties
    const totalProperties = await PropertyListing.countDocuments();
    console.log(`📊 Total properties in database: ${totalProperties}`);
    
    await mongoose.disconnect();
    console.log('\n🔌 Database connection closed.');
    
  } catch (error) {
    console.error('❌ Error checking property sources:', error);
    process.exit(1);
  }
}

// Run the check
checkPropertySources();
