const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Connect to database
mongoose.connect('mongodb://localhost:27017/roomtopia', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 🎯 50 MORE DIVERSE BUMIPUTERA USERS - Exhibition Ready!
const exhibitionUsers = [
  // 2022 INTAKE - FINAL YEAR STUDENTS (Age 21-22)
  {
    fullName: "Siti Nurhaliza Binti Ahmad",
    email: "2022456789@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2022456789",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Computer and Mathematical Sciences",
    course: "Bachelor of Computer Science",
    year: "4th Year",
    bio: "Final year CS student passionate about AI and machine learning. Love coding and problem-solving!",
    contactInfo: "012-345-6789"
  },
  {
    fullName: "Muhammad Aidil Bin Rashid",
    email: "2022567890@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2022567890",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Engineering",
    course: "Bachelor of Mechanical Engineering",
    year: "4th Year",
    bio: "Engineering student who loves innovation and technology. Always ready for new challenges!",
    contactInfo: "013-456-7890"
  },
  {
    fullName: "Nurul Aina Binti Zakaria",
    email: "2022678901@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2022678901",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Medicine",
    course: "Bachelor of Medicine",
    year: "4th Year",
    bio: "Medical student dedicated to helping others. Organized and disciplined in studies.",
    contactInfo: "014-567-8901"
  },
  {
    fullName: "Ahmad Danial Bin Mohd Yusof",
    email: "2022789012@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2022789012",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Business and Management",
    course: "Bachelor of Business Administration",
    year: "4th Year",
    bio: "Business student with entrepreneurial spirit. Love networking and building connections.",
    contactInfo: "015-678-9012"
  },
  {
    fullName: "Farah Syahirah Binti Abdullah",
    email: "2022890123@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2022890123",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Law",
    course: "Bachelor of Legal Studies",
    year: "4th Year",
    bio: "Law student passionate about justice and human rights. Detail-oriented and analytical.",
    contactInfo: "016-789-0123"
  },
  {
    name: "Yusof Rahman",
    email: "2022115678@student.uitm.edu.my",
    age: 21,
    gender: "Male",
    religion: "Muslim",
    contactInfo: "013-456-7890",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Engineering",
    year: "Final Year",
    aboutMe: {
      description: "Final year Mechanical Engineering student passionate about innovation and problem-solving. I enjoy collaborative projects and looking for motivated roommate who understands engineering lifestyle.",
      studyHabits: "Night Owl",
      cleanliness: "Clean",
      socialLevel: "Social",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Male Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 450-650",
      location: "Seksyen 13",
      lifestyle: "Balanced"
    },
    interests: ["Engineering", "Innovation", "Technology", "Sports", "Teamwork"]
  },
  {
    name: "Amir Hakim",
    email: "2022173456@student.uitm.edu.my",
    age: 21,
    gender: "Male",
    religion: "Muslim",
    contactInfo: "014-567-8901",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Business and Management",
    year: "Final Year",
    aboutMe: {
      description: "Business student with entrepreneurial aspirations. Active in student organizations and networking events. Looking for ambitious roommate who shares business interests and leadership qualities.",
      studyHabits: "Flexible",
      cleanliness: "Clean",
      socialLevel: "Very Social",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Male Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 500-700",
      location: "Setia Alam",
      lifestyle: "Social/Active"
    },
    interests: ["Business", "Entrepreneurship", "Leadership", "Networking", "Finance"]
  },
  {
    name: "Iskandar Zulkifli",
    email: "2022175890@student.uitm.edu.my",
    age: 21,
    gender: "Male",
    religion: "Muslim",
    contactInfo: "015-678-9012",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Law",
    year: "Final Year",
    aboutMe: {
      description: "Law student with strong analytical skills and attention to detail. Enjoy debates and intellectual discussions. Prefer quiet study environment and looking for serious, studious roommate.",
      studyHabits: "Night Owl",
      cleanliness: "Very Clean",
      socialLevel: "Quiet",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Male Only",
      roommateReligion: "Muslim Only",
      budgetRange: "RM 450-650",
      location: "Seksyen 7",
      lifestyle: "Quiet/Studious"
    },
    interests: ["Law", "Debate", "Politics", "Reading", "Research"]
  },
  {
    name: "Yahya Danial",
    email: "2022327567@student.uitm.edu.my",
    age: 21,
    gender: "Male",
    religion: "Muslim",
    contactInfo: "016-789-0123",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Art and Design",
    year: "Final Year",
    aboutMe: {
      description: "Creative Graphic Design student passionate about visual arts and digital media. Sometimes work late on creative projects. Looking for understanding roommate who appreciates creativity and arts.",
      studyHabits: "Night Owl",
      cleanliness: "Moderate",
      socialLevel: "Social",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Male Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 400-600",
      location: "Seksyen 2",
      lifestyle: "Balanced"
    },
    interests: ["Design", "Art", "Photography", "Digital Media", "Creativity"]
  },

  // 3RD YEAR STUDENTS (2023 intake) - Age 20
  {
    name: "Wan Nurhaliza",
    email: "2023513890@student.uitm.edu.my",
    age: 20,
    gender: "Female",
    religion: "Muslim",
    contactInfo: "017-890-1234",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Accountancy",
    year: "3rd Year",
    aboutMe: {
      description: "Accounting student preparing for professional exams. Disciplined and focused on career goals. Prefer organized living environment and looking for responsible roommate with similar values.",
      studyHabits: "Early Bird",
      cleanliness: "Very Clean",
      socialLevel: "Quiet",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Female Only",
      roommateReligion: "Muslim Only",
      budgetRange: "RM 400-600",
      location: "Ken Rimba",
      lifestyle: "Quiet/Studious"
    },
    interests: ["Accounting", "Finance", "Professional Development", "Reading", "Planning"]
  },
  {
    name: "Khalid Asyraf",
    email: "2023866123@student.uitm.edu.my",
    age: 20,
    gender: "Male",
    religion: "Muslim",
    contactInfo: "018-901-2345",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Sports Science and Recreation",
    year: "3rd Year",
    aboutMe: {
      description: "Sports Science student and athlete. Train regularly and maintain healthy lifestyle. Early riser and disciplined. Looking for roommate who understands and supports athletic lifestyle.",
      studyHabits: "Early Bird",
      cleanliness: "Clean",
      socialLevel: "Social",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Male Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 450-650",
      location: "Kota Kemuning",
      lifestyle: "Social/Active"
    },
    interests: ["Sports", "Fitness", "Nutrition", "Coaching", "Health"]
  },
  {
    name: "Dahlia Sofea",
    email: "2023053012@student.uitm.edu.my",
    age: 20,
    gender: "Female",
    religion: "Muslim",
    contactInfo: "019-012-3456",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Art and Design",
    year: "3rd Year",
    aboutMe: {
      description: "Creative Art student who loves expressing ideas through design and visual arts. Friendly and social, enjoy cultural activities and art exhibitions. Looking for creative, open-minded roommate.",
      studyHabits: "Night Owl",
      cleanliness: "Clean",
      socialLevel: "Very Social",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Female Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 350-550",
      location: "Seksyen 2",
      lifestyle: "Social/Active"
    },
    interests: ["Art", "Design", "Photography", "Cultural Events", "Fashion"]
  },
  {
    name: "Balqis Iman",
    email: "2023164345@student.uitm.edu.my",
    age: 20,
    gender: "Female",
    religion: "Muslim",
    contactInfo: "012-234-5678",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Business and Management",
    year: "3rd Year",
    aboutMe: {
      description: "Business student with leadership qualities and strong communication skills. Active in student organizations and enjoy networking events. Looking for ambitious, goal-oriented roommate.",
      studyHabits: "Flexible",
      cleanliness: "Clean",
      socialLevel: "Very Social",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Female Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 450-650",
      location: "Setia Alam",
      lifestyle: "Social/Active"
    },
    interests: ["Business", "Leadership", "Networking", "Events", "Communication"]
  }
];

async function createRealistic2025Profiles() {
  try {
    console.log('🎯 Creating realistic 2025 UiTM student roommate profiles...');
    
    // Clear existing auto-generated profiles
    await RoommateRequest.deleteMany({ source: 'Realistic 2025 Profiles' });
    console.log('🗑️ Cleared existing profiles');
    
    // Insert new realistic profiles
    const profilesToInsert = realistic2025Profiles.map(profile => ({
      ...profile,
      source: 'Realistic 2025 Profiles',
      createdAt: new Date()
    }));
    
    const result = await RoommateRequest.insertMany(profilesToInsert);
    
    console.log(`✅ Successfully created ${result.length} realistic 2025 roommate profiles!`);
    console.log('🎯 Features:');
    console.log('   📅 Valid 2025 matric numbers (2022-2025)');
    console.log('   👥 Full names (e.g., Zainab Zulia, Yusof Rahman)');
    console.log('   🎓 Logical age-year matching');
    console.log('   🧠 AI-compatible personalities');
    console.log('   📚 Diverse faculties and interests');
    
    console.log('\n📊 Profile breakdown:');
    const femaleCount = result.filter(r => r.gender === 'Female').length;
    const maleCount = result.filter(r => r.gender === 'Male').length;
    const finalYear = result.filter(r => r.year === 'Final Year').length;
    const thirdYear = result.filter(r => r.year === '3rd Year').length;
    
    console.log(`   👩 Female profiles: ${femaleCount}`);
    console.log(`   👨 Male profiles: ${maleCount}`);
    console.log(`   🎓 Final year (2022): ${finalYear}`);
    console.log(`   📚 3rd year (2023): ${thirdYear}`);
    
    // Close connection
    await mongoose.disconnect();
    console.log('🔌 Database connection closed.');
    
  } catch (error) {
    console.error('❌ Error creating realistic profiles:', error);
    process.exit(1);
  }
}

// Run the creation
createRealistic2025Profiles();
