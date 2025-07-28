const mongoose = require('mongoose');
const RoommateRequest = require('../models/RoommateRequest');
const User = require('../models/User');

// Connect to database
mongoose.connect('mongodb://localhost:27017/roomtopia', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 🎯 EXHIBITION ROOMMATE REQUESTS - Using real user emails
const roommateRequests = [
  {
    name: "Siti Nurhaliza",
    email: "2022456789@student.uitm.edu.my",
    age: 21,
    gender: "Female",
    religion: "Islam",
    contact: "012-345-6789",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Computer and Mathematical Sciences",
    year: "4th Year",
    location: "Seksyen 7, Shah Alam",
    budget: 500,
    preferences: {
      roommateGender: "Female Only",
      roommateReligion: "Islam Only",
      budgetRange: "RM 400-600",
      location: "Near UiTM Shah Alam",
      lifestyle: "Quiet/Studious"
    },
    aboutMe: {
      description: "Final year CS student. Clean, organized, and focused on studies. Looking for like-minded roommate.",
      studyHabits: "Morning Person",
      cleanliness: "Very Clean",
      socialLevel: "Introvert",
      smoker: false
    },
    interests: ["Programming", "AI", "Reading", "Technology", "Islamic Studies"]
  },
  {
    name: "Muhammad Aidil",
    email: "2022567890@student.uitm.edu.my",
    age: 21,
    gender: "Male",
    religion: "Islam",
    contact: "013-456-7890",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Engineering",
    year: "4th Year",
    location: "Seksyen 13, Shah Alam",
    budget: 550,
    preferences: {
      roommateGender: "Male Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 450-650",
      location: "Shah Alam area",
      lifestyle: "Balanced"
    },
    aboutMe: {
      description: "Engineering student who loves innovation. Friendly and easy-going. Open to different cultures.",
      studyHabits: "Night Owl",
      cleanliness: "Moderate",
      socialLevel: "Extrovert",
      smoker: false
    },
    interests: ["Engineering", "Innovation", "Sports", "Technology", "Teamwork"]
  },
  {
    name: "Nurul Aina",
    email: "2022678901@student.uitm.edu.my",
    age: 21,
    gender: "Female",
    religion: "Islam",
    contact: "014-567-8901",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Medicine",
    year: "4th Year",
    location: "Kota Kemuning",
    budget: 700,
    preferences: {
      roommateGender: "Female Only",
      roommateReligion: "Islam Only",
      budgetRange: "RM 600-800",
      location: "Near hospital/clinic",
      lifestyle: "Quiet/Studious"
    },
    aboutMe: {
      description: "Medical student with demanding schedule. Very disciplined and clean. Need understanding roommate.",
      studyHabits: "Morning Person",
      cleanliness: "Very Clean",
      socialLevel: "Balanced",
      smoker: false
    },
    interests: ["Medicine", "Healthcare", "Research", "Fitness", "Volunteering"]
  },
  {
    name: "Ahmad Danial",
    email: "2022789012@student.uitm.edu.my",
    age: 21,
    gender: "Male",
    religion: "Islam",
    contact: "015-678-9012",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Business and Management",
    year: "4th Year",
    location: "Setia Alam",
    budget: 600,
    preferences: {
      roommateGender: "Male Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 500-700",
      location: "Near business district",
      lifestyle: "Social/Active"
    },
    aboutMe: {
      description: "Business student with entrepreneurial spirit. Social and networking-oriented. Love meeting new people.",
      studyHabits: "Flexible",
      cleanliness: "Moderate",
      socialLevel: "Extrovert",
      smoker: false
    },
    interests: ["Business", "Entrepreneurship", "Networking", "Leadership", "Finance"]
  },
  {
    name: "Farah Syahirah",
    email: "2022890123@student.uitm.edu.my",
    age: 21,
    gender: "Female",
    religion: "Islam",
    contact: "016-789-0123",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Law",
    year: "4th Year",
    location: "Seksyen 2, Shah Alam",
    budget: 450,
    preferences: {
      roommateGender: "Female Only",
      roommateReligion: "Islam Only",
      budgetRange: "RM 400-600",
      location: "Near law library",
      lifestyle: "Quiet/Studious"
    },
    aboutMe: {
      description: "Law student passionate about justice. Detail-oriented and analytical. Prefer quiet study environment.",
      studyHabits: "Night Owl",
      cleanliness: "Very Clean",
      socialLevel: "Introvert",
      smoker: false
    },
    interests: ["Law", "Justice", "Human Rights", "Reading", "Research"]
  },
  {
    name: "Nur Syafiqah",
    email: "2023456789@student.uitm.edu.my",
    age: 20,
    gender: "Female",
    religion: "Islam",
    contact: "014-345-6789",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Computer and Mathematical Sciences",
    year: "3rd Year",
    location: "Ken Rimba, Shah Alam",
    budget: 400,
    preferences: {
      roommateGender: "Female Only",
      roommateReligion: "Islam Only",
      budgetRange: "RM 350-500",
      location: "Budget-friendly area",
      lifestyle: "Balanced"
    },
    aboutMe: {
      description: "IT student specializing in cybersecurity. Tech-savvy and love solving problems. Friendly and helpful.",
      studyHabits: "Night Owl",
      cleanliness: "Moderate",
      socialLevel: "Balanced",
      smoker: false
    },
    interests: ["Cybersecurity", "Technology", "Gaming", "Problem Solving", "Learning"]
  },
  {
    name: "Muhammad Haziq",
    email: "2023567890@student.uitm.edu.my",
    age: 20,
    gender: "Male",
    religion: "Islam",
    contact: "015-456-7890",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Civil Engineering",
    year: "3rd Year",
    location: "Bukit Jelutong",
    budget: 500,
    preferences: {
      roommateGender: "Male Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 450-600",
      location: "Near construction sites",
      lifestyle: "Balanced"
    },
    aboutMe: {
      description: "Civil engineering student interested in sustainable construction. Practical and down-to-earth person.",
      studyHabits: "Morning Person",
      cleanliness: "Moderate",
      socialLevel: "Balanced",
      smoker: false
    },
    interests: ["Civil Engineering", "Construction", "Sustainability", "Environment", "Innovation"]
  },
  {
    name: "Dayang Nurhaliza",
    email: "2025901234@student.uitm.edu.my",
    age: 19,
    gender: "Female",
    religion: "Islam",
    contact: "015-890-1234",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Communication and Media Studies",
    year: "1st Year",
    location: "Seksyen 7, Shah Alam",
    budget: 350,
    preferences: {
      roommateGender: "Female Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 300-450",
      location: "Student-friendly area",
      lifestyle: "Social/Active"
    },
    aboutMe: {
      description: "Sabahan student passionate about media. Love documenting culture and making new friends from different backgrounds.",
      studyHabits: "Flexible",
      cleanliness: "Moderate",
      socialLevel: "Extrovert",
      smoker: false
    },
    interests: ["Media", "Photography", "Culture", "Storytelling", "Travel"]
  },
  {
    name: "Anak Jelani",
    email: "2024567123@student.uitm.edu.my",
    age: 19,
    gender: "Male",
    religion: "Islam",
    contact: "012-345-6789",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Plantation and Agrotechnology",
    year: "2nd Year",
    location: "Puncak Alam",
    budget: 400,
    preferences: {
      roommateGender: "Male Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 350-500",
      location: "Near agricultural areas",
      lifestyle: "Balanced"
    },
    aboutMe: {
      description: "Sarawakian student studying agriculture. Love nature and sustainable farming. Easy-going and respectful.",
      studyHabits: "Morning Person",
      cleanliness: "Moderate",
      socialLevel: "Balanced",
      smoker: false
    },
    interests: ["Agriculture", "Sustainability", "Nature", "Research", "Environment"]
  },
  {
    name: "Nur Balqis",
    email: "2024456789@student.uitm.edu.my",
    age: 19,
    gender: "Female",
    religion: "Islam",
    contact: "016-345-6789",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Computer and Mathematical Sciences",
    year: "2nd Year",
    location: "Seksyen 13, Shah Alam",
    budget: 450,
    preferences: {
      roommateGender: "Female Only",
      roommateReligion: "Islam Only",
      budgetRange: "RM 400-550",
      location: "Near campus",
      lifestyle: "Balanced"
    },
    aboutMe: {
      description: "Data science student passionate about analytics. Love working with data and discovering insights.",
      studyHabits: "Night Owl",
      cleanliness: "Moderate",
      socialLevel: "Balanced",
      smoker: false
    },
    interests: ["Data Science", "Analytics", "Machine Learning", "Statistics", "Technology"]
  }
];

async function createExhibitionRoommateRequests() {
  try {
    console.log('🏠 Creating exhibition roommate requests...');
    console.log(`📊 Total requests to create: ${roommateRequests.length}`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const requestData of roommateRequests) {
      try {
        // Check if request already exists for this user
        const existingRequest = await RoommateRequest.findOne({ 
          userEmail: requestData.email 
        });
        
        if (existingRequest) {
          console.log(`⚠️ Roommate request already exists for: ${requestData.email}`);
          continue;
        }
        
        // Create roommate request
        const roommateRequest = new RoommateRequest({
          ...requestData,
          userEmail: requestData.email,
          status: 'active',
          createdAt: new Date()
        });
        
        await roommateRequest.save();
        successCount++;
        console.log(`✅ Created roommate request: ${requestData.name} (${requestData.email})`);
        
      } catch (requestError) {
        errorCount++;
        console.error(`❌ Error creating request for ${requestData.email}:`, requestError.message);
      }
    }
    
    console.log(`\n🎉 Exhibition roommate requests creation completed!`);
    console.log(`✅ Successfully created: ${successCount} requests`);
    console.log(`❌ Errors: ${errorCount} requests`);
    console.log(`📊 Total attempted: ${roommateRequests.length} requests`);
    
    // Close connection
    await mongoose.disconnect();
    console.log('🔌 Database connection closed.');
    
  } catch (error) {
    console.error('❌ Error in exhibition roommate requests creation:', error);
    process.exit(1);
  }
}

// Run the creation
createExhibitionRoommateRequests();
