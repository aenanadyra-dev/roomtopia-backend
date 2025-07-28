const mongoose = require('mongoose');

const aiMatchSchema = new mongoose.Schema({
  user1Id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  user2Id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // AI COMPATIBILITY RESULTS
  compatibilityScore: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  
  aiAnalysis: {
    strengths: [String],
    concerns: [String],
    recommendation: String,
    confidenceLevel: { type: Number, default: 75 }
  },
  
  // DETAILED BREAKDOWN
  compatibilityFactors: {
    ageCompatibility: Number,
    budgetCompatibility: Number,
    interestSimilarity: Number,
    lifestyleCompatibility: Number,
    personalityMatch: Number
  },
  
  // AI MODEL INFO
  aiModelUsed: { type: String, default: 'gpt-3.5-turbo' },
  calculatedAt: { type: Date, default: Date.now },
  
  // USER INTERACTIONS
  user1Interested: { type: Boolean, default: false },
  user2Interested: { type: Boolean, default: false },
  mutualMatch: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Prevent duplicate matches
aiMatchSchema.index({ user1Id: 1, user2Id: 1 }, { unique: true });

module.exports = mongoose.model('AIMatch', aiMatchSchema);
