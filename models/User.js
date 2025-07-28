const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  matricNumber: {
    type: String,
    required: function() {
      return this.role === 'student';
    },
    unique: true,
    sparse: true,
    trim: true
  },
  contactInfo: {
    type: String,
    default: ''
  },
  preferences: {
    lifestyle: {
      type: String,
      default: ''
    },
    tenantType: {
      type: String,
      default: ''
    }
  },
  // Profile fields
  profilePicture: {
  type: String,
  default: null // Will store the file path
},
  address: { type: String, default: '' },
  gender: { type: String, default: '' },
  dob: { type: Date },
  university: { type: String, default: '' },
  course: { type: String, default: '' },
  year: { type: String, default: '' },
  faculty: { type: String, default: '' },        // ← ADDITION
  bio: { type: String, default: '', maxlength: 300 }, // ← ADDITION
  
//DREAM HOME BUTTON
dreamHomes: [{
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  savedAt: { type: Date, default: Date.now }
}],

  // Role management
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  
  // Admin-specific fields
  adminLevel: {
    type: String,
    enum: ['super', 'moderator', 'support'],
    default: 'moderator',
    required: function() {
      return this.role === 'admin';
    }
  },
  
  // Activity tracking
  lastLogin: {
    type: Date,
    default: null
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  joinedDate: {
    type: Date,
    default: Date.now
  },
  
  // AI ROOMMATE MATCHING PROFILE
  roommateProfile: {
    age: Number,
    gender: String,
    course: String,
    year: String,
    bio: String,
    interests: [String],
    budgetMin: { type: Number, default: 300 },
    budgetMax: { type: Number, default: 700 },
    smoking: { type: Boolean, default: false },
    
    // AI PERSONALITY DATA
    personalityVector: [Number],
    lifestylePreferences: {
      sleepSchedule: { type: String, default: "flexible" },
      cleanliness: { type: Number, default: 5 },
      socialLevel: { type: Number, default: 5 },
      studyHabits: { type: String, default: "flexible" },
      guestPolicy: { type: String, default: "occasional" }
    },
    
    // COMPATIBILITY HISTORY
    compatibilityScores: [{
      withUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      score: Number,
      calculatedAt: Date,
      aiAnalysis: {
        strengths: [String],
        concerns: [String],
        recommendation: String
      }
    }]
  }
}, {
  timestamps: true
});

// Create indexes manually to avoid duplicates
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ matricNumber: 1 }, { unique: true, sparse: true });
userSchema.index({ role: 1 });

// Hash password before saving - DISABLED (doing it in routes instead)
userSchema.pre('save', async function(next) {
  next(); // Skip password hashing here
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to check if user is admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Method to update last login time
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Method to get user's public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
