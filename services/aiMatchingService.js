const OpenAI = require('openai');

class AIMatchingService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async calculateCompatibilityScore(user1, user2) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an AI roommate compatibility expert. Analyze two user profiles and calculate a compatibility score from 0-100.

Consider these factors:
- Lifestyle habits (sleep schedule, cleanliness, social preferences)
- Academic compatibility (study habits, course similarity)
- Personality traits and interests
- Budget compatibility
- Location preferences
- Age and gender compatibility

Return ONLY a JSON object with:
{
  "compatibilityScore": number (0-100),
  "strengths": ["list", "of", "compatibility", "strengths"],
  "concerns": ["list", "of", "potential", "concerns"],
  "recommendation": "brief recommendation text"
}`
          },
          {
            role: "user",
            content: `Analyze compatibility between:

User 1:
- Name: ${user1.name}
- Age: ${user1.age}
- Gender: ${user1.gender}
- Course: ${user1.course}
- Bio: ${user1.bio}
- Interests: ${user1.interests?.join(', ')}
- Budget: RM${user1.budgetMin}-${user1.budgetMax}
- Smoking: ${user1.smoking ? 'Yes' : 'No'}

User 2:
- Name: ${user2.name}
- Age: ${user2.age}
- Gender: ${user2.gender}
- Course: ${user2.course}
- Bio: ${user2.bio}
- Interests: ${user2.interests?.join(', ')}
- Budget: RM${user2.budgetMin}-${user2.budgetMax}
- Smoking: ${user2.smoking ? 'Yes' : 'No'}`
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response);
      
    } catch (error) {
      console.error('AI matching error:', error);
      return this.fallbackCompatibilityScore(user1, user2);
    }
  }

  fallbackCompatibilityScore(user1, user2) {
    let score = 50; // Base score
    
    // Age compatibility (closer ages = higher score)
    const ageDiff = Math.abs(user1.age - user2.age);
    score += Math.max(0, 20 - ageDiff * 2);
    
    // Gender compatibility
    if (user1.gender === user2.gender) score += 10;
    
    // Budget compatibility
    const budgetOverlap = this.calculateBudgetOverlap(user1, user2);
    score += budgetOverlap * 15;
    
    // Interest similarity
    const interestSimilarity = this.calculateInterestSimilarity(user1, user2);
    score += interestSimilarity * 20;
    
    // Smoking compatibility
    if (user1.smoking === user2.smoking) score += 5;
    
    return {
      compatibilityScore: Math.min(100, Math.max(0, score)),
      strengths: this.generateStrengths(user1, user2),
      concerns: this.generateConcerns(user1, user2),
      recommendation: score > 70 ? "Highly compatible!" : score > 50 ? "Good potential match" : "Consider carefully"
    };
  }

  calculateBudgetOverlap(user1, user2) {
    const overlap = Math.max(0, 
      Math.min(user1.budgetMax, user2.budgetMax) - 
      Math.max(user1.budgetMin, user2.budgetMin)
    );
    const totalRange = Math.max(user1.budgetMax, user2.budgetMax) - 
                      Math.min(user1.budgetMin, user2.budgetMin);
    return totalRange > 0 ? overlap / totalRange : 0;
  }

  calculateInterestSimilarity(user1, user2) {
    const interests1 = user1.interests || [];
    const interests2 = user2.interests || [];
    
    if (interests1.length === 0 || interests2.length === 0) return 0;
    
    const commonInterests = interests1.filter(interest => 
      interests2.some(int2 => 
        int2.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(int2.toLowerCase())
      )
    );
    
    return commonInterests.length / Math.max(interests1.length, interests2.length);
  }

  generateStrengths(user1, user2) {
    const strengths = [];
    if (user1.gender === user2.gender) strengths.push("Same gender preference");
    if (Math.abs(user1.age - user2.age) <= 3) strengths.push("Similar age group");
    if (user1.smoking === user2.smoking) strengths.push("Compatible smoking preferences");
    return strengths;
  }

  generateConcerns(user1, user2) {
    const concerns = [];
    if (Math.abs(user1.age - user2.age) > 5) concerns.push("Significant age difference");
    if (user1.smoking !== user2.smoking) concerns.push("Different smoking preferences");
    return concerns;
  }

  async findBestMatches(currentUser, allUsers, limit = 10) {
    const matches = [];
    
    for (const user of allUsers) {
      if (user._id.toString() === currentUser._id.toString()) continue;
      
      const compatibility = await this.calculateCompatibilityScore(currentUser, user);
      
      matches.push({
        user: user,
        compatibility: compatibility
      });
    }
    
    // Sort by compatibility score and return top matches
    return matches
      .sort((a, b) => b.compatibility.compatibilityScore - a.compatibility.compatibilityScore)
      .slice(0, limit);
  }
}

module.exports = AIMatchingService;
