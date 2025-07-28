const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'property_search',
      'roommate_search',
      'property_view',
      'roommate_match',
      'property_bookmark',    // ✅ NEW
      'location_search',      // ✅ NEW
      'roommate_preference',
      'roommate_view',        // ✅ NEW
      'roommate_post_created', // ✅ NEW - Track when roommate posts are created
      'roommate_post_deleted'  // ✅ NEW - Track when roommate posts are deleted
    ],
    required: true
  },
  data: {
    location: String,
    propertyType: String,
    priceRange: String,
    roommateGender: String,
    roommateAge: String,
    searchFilters: Object,
    // ✅ NEW FIELDS
    propertyId: String,
    price: Number,
    searchContext: String,
    preferenceType: String,
    gender: String,
    religion: String,
    studyHabits: String,
    cleanliness: String,
    socialLevel: String,
    smokingPreference: String,
    minPrice: Number,
    maxPrice: Number,
    genderPreference: String,
    religiousPreference: String,
    hasAICriteria: Boolean,
    filtersUsed: Number,
     roommateId: String,
    university: String,
    aiMatchPercentage: Number,
    viewSource: String,
    userEmail: String,
    preferenceValue: String
  },

  userId: {
    type: String,
    default: 'anonymous'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sessionId: String
});

module.exports = mongoose.model('Analytics', analyticsSchema);