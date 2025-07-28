const mongoose = require('mongoose');

const roommateRequestSchema = new mongoose.Schema({
  // Personal Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: false,
    min: 18,
    max: 35
  },
  gender: {
    type: String,
    required: false,
    enum: ['Male', 'Female'] // ✅ MATCHES PostRoommate exactly
  },
  religion: {
    type: String,
    required: false
  },
  contact: {
    type: String,
    required: false
  },

  // Academic Information
  university: {
    type: String,
    default: 'UiTM Shah Alam'
  },
  faculty: {
    type: String,
    required: false
  },
  year: {
    type: String,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'], // ✅ MATCHES PostRoommate exactly
    required: false
  },

  // ✅ DIRECT FIELDS FROM POSTROOMMATE FORM
  location: {
    type: String,
    required: false
  },
  budget: {
    type: Number,
    required: false
  },
  description: {
    type: String,
    required: false,
    maxlength: 1000
  },
  
  // ✅ WHAT I SEEK IN A ROOMMATE (PREFERENCES) - MATCHES PostRoommate exactly
  preferences: {
    gender: { 
      type: String, 
      enum: ['Male', 'Female', 'No Preference'], // ✅ MATCHES PostRoommate
      required: false 
    },
    religion: { 
      type: String, 
      required: false 
    },
    habits: [{ type: String }],
    cleanliness: { 
      type: String, 
      enum: ['Very Clean', 'Moderate', 'Relaxed'], // ✅ MATCHES PostRoommate
      required: false 
    },
    socialLevel: { 
      type: String, 
      enum: ['Introvert', 'Extrovert', 'Balanced'], // ✅ MATCHES PostRoommate
      required: false 
    },
    smoker: { 
      type: Boolean, 
      required: false 
    },
    studyHabits: { 
      type: String, 
      enum: ['Morning Person', 'Night Owl', 'Flexible'], // ✅ MATCHES PostRoommate
      required: false,
      default: 'Flexible'
    }
  },

  // ✅ ABOUT ME & MY LIFESTYLE - MATCHES PostRoommate exactly
  aboutMe: {
    description: { 
      type: String, 
      required: false, 
      maxlength: 1000 
    },
    studyHabits: { 
      type: String, 
      enum: ['Morning Person', 'Night Owl', 'Flexible'], // ✅ MATCHES PostRoommate
      required: false 
    },
    cleanliness: { 
      type: String, 
      enum: ['Very Clean', 'Moderate', 'Relaxed'], // ✅ MATCHES PostRoommate
      required: false 
    },
    socialLevel: { 
      type: String, 
      enum: ['Introvert', 'Extrovert', 'Balanced'], // ✅ MATCHES PostRoommate
      required: false 
    },
    smoker: { 
      type: Boolean, 
      required: false 
    }
  },

  // Interests & Hobbies
  interests: [{ type: String }],

  // System fields
  status: {
    type: String,
    enum: ['pending', 'approved', 'flagged', 'active'],
    default: 'active'
  },
  userEmail: {
    type: String,
    required: true
  },

  // ✅ PROFILE PICTURE FROM USER PROFILE
  profilePicture: {
    type: String,
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

// ✅ INDEXES FOR PERFORMANCE
roommateRequestSchema.index({ userEmail: 1 }, { 
  unique: true, 
  partialFilterExpression: { userEmail: { $exists: true } }
});

roommateRequestSchema.index({ location: 1 });
roommateRequestSchema.index({ budget: 1 });
roommateRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('RoommateRequest', roommateRequestSchema);
