const mongoose = require('mongoose');
const RoommateRequest = require('../models/RoommateRequest');

// Connect to database
mongoose.connect('mongodb://localhost:27017/roomtopia');

// 🎯 ROOMMATE REQUESTS FOR YOUR ACTUAL USERS + DEMO DATA
const roommateRequests = [
  // 🎯 KHALID ASYRAF - Your actual user!
  {
    name: "Khalid Asyraf",
    age: 21,
    gender: "Male",
    religion: "Islam",
    contact: "013-456-7890",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Computer and Mathematical Sciences",
    year: "3rd Year",
    location: "Seksyen 25",
    budget: 500,
    description: "Computer Science student passionate about programming and technology. Looking for a responsible roommate who respects study time and maintains cleanliness. I enjoy coding projects and gaming in my free time.",
    aboutMe: {
      description: "I'm a Computer Science student who loves coding and reading. I'm looking for a clean and quiet roommate who respects study time. I enjoy coding projects and gaming in my free time.",
      studyHabits: "Morning Person",
      cleanliness: "Very Clean",
      socialLevel: "Balanced",
      smoker: false
    },
    preferences: {
      gender: "Male",
      religion: "Muslim",
      cleanliness: "Very Clean",
      socialLevel: "Balanced",
      smoker: false,
      studyHabits: "Morning Person"
    },
    interests: ["Programming", "Gaming", "Reading", "Technology", "Islamic Studies"],
    userEmail: "2023866123@student.uitm.edu.my",
    source: "Exhibition Demo Data",
    createdAt: new Date()
  },

  // 🎯 AHMAD FAIZ - Another actual user
  {
    name: "Ahmad Faiz",
    age: 22,
    gender: "Male",
    religion: "Muslim",
    contact: "013-789-0123",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Business and Management",
    year: "4th Year",
    location: "Seksyen 13",
    budget: 600,
    description: "Final year Business student who's serious about studies but also enjoys socializing. I'm clean, responsible, and looking for someone who can balance study and fun.",
    aboutMe: {
      description: "Final year Business student who's serious about studies but also enjoys socializing. I'm clean, responsible, and looking for someone who can balance study and fun. I play futsal on weekends.",
      studyHabits: "Night Owl",
      cleanliness: "Very Clean",
      socialLevel: "Extrovert",
      smoker: false
    },
    preferences: {
      gender: "Male",
      religion: "Muslim",
      cleanliness: "Very Clean",
      socialLevel: "Extrovert",
      smoker: false,
      studyHabits: "Flexible"
    },
    interests: ["Futsal", "Food", "Business", "Traveling", "Gaming"],
    userEmail: "2020378000@student.uitm.edu.my",
    source: "Exhibition Demo Data",
    createdAt: new Date()
  },

  // 🎯 NUR AMIRA SOFEA - Female user
  {
    name: "Nur Amira Sofea",
    age: 20,
    gender: "Female",
    religion: "Muslim",
    contact: "012-345-6789",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Applied Sciences",
    year: "2nd Year",
    location: "Seksyen 9",
    budget: 450,
    description: "Applied Sciences student passionate about research and laboratory work. I'm patient, caring, and love helping others learn. Looking for a supportive roommate who shares similar values.",
    aboutMe: {
      description: "Applied Sciences student passionate about research and laboratory work. I'm patient, caring, and love helping others learn. I enjoy crafts and educational activities.",
      studyHabits: "Morning Person",
      cleanliness: "Very Clean",
      socialLevel: "Balanced",
      smoker: false
    },
    preferences: {
      gender: "Female",
      religion: "Muslim",
      cleanliness: "Very Clean",
      socialLevel: "Balanced",
      smoker: false,
      studyHabits: "Morning Person"
    },
    interests: ["Research", "Laboratory Work", "Science", "Reading", "Environmental Studies"],
    userEmail: "2022456789@student.uitm.edu.my",
    source: "Exhibition Demo Data",
    createdAt: new Date()
  },
  // 🎯 SARAH BINTI AHMAD - Art student from Sarawak
  {
    name: "Sarah Binti Ahmad",
    age: 19,
    gender: "Female",
    religion: "Christian",
    contact: "014-567-8901",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Art and Design",
    year: "1st Year",
    location: "Seksyen 2",
    budget: 400,
    description: "Art student from Sarawak who's creative and loves expressing myself through various mediums. I'm looking for an open-minded roommate who appreciates creativity.",
    aboutMe: {
      description: "Art student from Sarawak who's creative and loves expressing myself through various mediums. I'm looking for an open-minded roommate who appreciates creativity. I love music and often listen while working.",
      studyHabits: "Flexible",
      cleanliness: "Moderate",
      socialLevel: "Balanced",
      smoker: false
    },
    preferences: {
      gender: "No Preference",
      religion: "Any Religion",
      cleanliness: "Moderate",
      socialLevel: "Balanced",
      smoker: false,
      studyHabits: "Flexible"
    },
    interests: ["Art", "Music", "Photography", "Movies", "Cultural Heritage"],
    userEmail: "2023012000@student.uitm.edu.my",
    source: "Exhibition Demo Data",
    createdAt: new Date()
  },
  // 🎯 DANIEL ANAK JIMMY - Engineering student from Sabah
  {
    name: "Daniel Anak Jimmy",
    age: 21,
    gender: "Male",
    religion: "Christian",
    contact: "015-678-9012",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Engineering",
    year: "3rd Year",
    location: "i-City",
    budget: 550,
    description: "Engineering student from Sabah passionate about technology and innovation. I spend a lot of time on projects and coding. Looking for someone who understands the engineering lifestyle.",
    aboutMe: {
      description: "Engineering student from Sabah passionate about technology and innovation. I spend a lot of time on projects and coding. Looking for someone who understands the engineering lifestyle - sometimes late nights, sometimes early mornings.",
      studyHabits: "Night Owl",
      cleanliness: "Very Clean",
      socialLevel: "Balanced",
      smoker: false
    },
    preferences: {
      gender: "Male",
      religion: "Any Religion",
      cleanliness: "Very Clean",
      socialLevel: "Balanced",
      smoker: false,
      studyHabits: "Night Owl"
    },
    interests: ["Technology", "Programming", "Traditional Music", "Movies", "Robotics"],
    userEmail: "2021282000@student.uitm.edu.my",
    source: "Exhibition Demo Data",
    createdAt: new Date()
  },
  // 🎯 NURUL HUDA BINTI HASSAN - Built Environment student
  {
    name: "Nurul Huda Binti Hassan",
    age: 20,
    gender: "Female",
    religion: "Muslim",
    contact: "016-789-0123",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Built Environment",
    year: "2nd Year",
    location: "Seksyen 25",
    budget: 650,
    description: "Built Environment student with a demanding schedule but I try to maintain work-life balance. I'm very organized and clean due to my architectural training.",
    aboutMe: {
      description: "Built Environment student with a demanding schedule but I try to maintain work-life balance. I'm very organized and clean due to my architectural training. Looking for someone who's understanding of my study schedule.",
      studyHabits: "Morning Person",
      cleanliness: "Very Clean",
      socialLevel: "Balanced",
      smoker: false
    },
    preferences: {
      gender: "Female",
      religion: "Muslim",
      cleanliness: "Very Clean",
      socialLevel: "Balanced",
      smoker: false,
      studyHabits: "Morning Person"
    },
    interests: ["Architecture", "Design", "Urban Planning", "Reading", "Islamic Studies"],
    userEmail: "2022615000@student.uitm.edu.my",
    source: "Exhibition Demo Data",
    createdAt: new Date()
  },
  // 🎯 NURUL AINA - Communication student
  {
    name: "Nurul Aina",
    age: 19,
    gender: "Female",
    religion: "Muslim",
    contact: "018-901-2345",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Communication and Media Studies",
    year: "1st Year",
    location: "Setia Alam",
    budget: 450,
    description: "Communication student who loves meeting new people and learning about different cultures. I'm outgoing and friendly, always up for trying new things.",
    aboutMe: {
      description: "Communication student who loves meeting new people and learning about different cultures. I'm outgoing and friendly, always up for trying new things. I love organizing events and social gatherings.",
      studyHabits: "Flexible",
      cleanliness: "Moderate",
      socialLevel: "Extrovert",
      smoker: false
    },
    preferences: {
      gender: "Female",
      religion: "Any Religion",
      cleanliness: "Moderate",
      socialLevel: "Extrovert",
      smoker: false,
      studyHabits: "Flexible"
    },
    interests: ["Media", "Photography", "Event Planning", "Traveling", "Fashion"],
    userEmail: "2023567890@student.uitm.edu.my",
    source: "Exhibition Demo Data",
    createdAt: new Date()
  }
];

async function seedRoommateRequests() {
  try {
    console.log('👥 Starting roommate requests seeding...');
    
    // Clear existing demo roommate requests
    await RoommateRequest.deleteMany({ source: 'Exhibition Demo Data' });
    console.log('🗑️ Cleared existing demo roommate requests');
    
    // Insert new roommate requests
    const result = await RoommateRequest.insertMany(roommateRequests);
    
    console.log(`✅ Successfully inserted ${result.length} roommate requests!`);
    console.log('👥 Diverse profiles including:');
    console.log('   - Different faculties and years');
    console.log('   - Various religions and backgrounds');
    console.log('   - Different lifestyle preferences');
    console.log('   - Range of budget requirements');
    console.log('   - Varied interests and hobbies');
    
    // Close connection
    await mongoose.disconnect();
    console.log('🔌 Database connection closed.');
    
  } catch (error) {
    console.error('❌ Error seeding roommate requests:', error);
    process.exit(1);
  }
}

// Run the seeding
seedRoommateRequests();
