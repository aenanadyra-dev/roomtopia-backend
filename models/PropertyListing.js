const mongoose = require('mongoose');

const propertyListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Single Room', 'Shared Room', 'Master Room', 'Studio', 'Apartment', 'House'],
    required: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  contact: {
    type: String
  },
  
  // FIXED: Support both field names for photos
  images: [{
    type: String
  }],
  photos: [{  // ADDED: This field for new PostProperty submissions
    type: String
  }],
  
  amenities: [{
    type: String
  }],
  coordinates: {
    lat: Number,
    lng: Number
  },
  
  // USER OWNERSHIP
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  userEmail: {
    type: String,
    required: false
  },
  source: {
    type: String,
    default: 'User Submission'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  scrapedAt: {
    type: Date,
    default: Date.now
  },
  
  // ADDED: All the new fields from your PostProperty form
  shareholderName: {
    type: String,
    required: false
  },
  shareholderAddress: {
    type: String,
    required: false
  },
  phoneNumber: {
    type: String,
    required: false
  },
  shareContract: {
    type: String,
    required: false
  },
  priceRate: {
    type: String,
    required: false
  },
  numberOfRooms: {
    type: String,
    required: false
  },
  rentalType: {
    type: String,
    required: false
  },
  furnishing: {
    type: String,
    required: false
  },
  parkingAvailability: {
    type: String,
    required: false
  },
  writtenDate: {
    type: String,
    required: false
  },
  writtenTime: {
    type: String,
    required: false
  },

  // ✨ NEW: TENANT PREFERENCES - FIXED ENUM VALUES! ✨
  preferredGender: {
    type: String,
    required: false
  },
  religiousPreference: {
    type: String,
    required: false
  },
  studentYearPreference: {
    type: String,
    required: false
  },
  lifestylePreference: {
    type: String,
    required: false
  },
  smokingPreference: {
    type: String,
    required: false
  },
  studyHabitsPreference: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Indexes for better search performance
propertyListingSchema.index({ location: 1 });
propertyListingSchema.index({ price: 1 });
propertyListingSchema.index({ type: 1 });
propertyListingSchema.index({ userId: 1 });
propertyListingSchema.index({ userEmail: 1 });

// NEW: Indexes for tenant preferences (for faster filtering)
propertyListingSchema.index({ preferredGender: 1 });
propertyListingSchema.index({ religiousPreference: 1 });
propertyListingSchema.index({ smokingPreference: 1 });

module.exports = mongoose.model('PropertyListing', propertyListingSchema);