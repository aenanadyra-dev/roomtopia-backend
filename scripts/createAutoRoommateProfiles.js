const mongoose = require('mongoose');
const RoommateRequest = require('../models/RoommateRequest');

// Connect to database
mongoose.connect('mongodb://localhost:27017/roomtopia', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 🎯 REALISTIC 2025 UiTM STUDENTS - Valid matric numbers with logical profiles
const userProfiles = [
  // FINAL YEAR FEMALE STUDENTS (2022 intake)
  {
    name: "Zainab Zulia",
    email: "2022101234@student.uitm.edu.my",
    age: 21,
    gender: "Female",
    religion: "Muslim",
    contactInfo: "012-345-6789",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Computer and Mathematical Sciences",
    year: "Final Year",
    aboutMe: {
      description: "Final year Computer Science student who loves coding and Islamic studies. I'm very organized and prefer a quiet study environment. Looking for a clean, respectful roommate who shares similar values.",
      studyHabits: "Early Bird",
      cleanliness: "Very Clean",
      socialLevel: "Moderate",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Female Only",
      roommateReligion: "Muslim Only",
      budgetRange: "RM 400-600",
      location: "Seksyen 7",
      lifestyle: "Quiet/Studious"
    },
    interests: ["Programming", "Islamic Studies", "Reading", "Cooking", "Technology"]
  },
  {
    name: "Qistina Amira",
    email: "2022187234@student.uitm.edu.my",
    age: 21,
    gender: "Female",
    religion: "Muslim",
    contactInfo: "016-789-0123",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Medicine",
    year: "Final Year",
    aboutMe: {
      description: "Medical student with a demanding schedule. Very clean and organized due to medical training. Looking for understanding roommate who respects study time and maintains high cleanliness standards.",
      studyHabits: "Early Bird",
      cleanliness: "Very Clean",
      socialLevel: "Moderate",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Female Only",
      roommateReligion: "Muslim Only",
      budgetRange: "RM 500-800",
      location: "Seksyen 13",
      lifestyle: "Quiet/Studious"
    },
    interests: ["Medicine", "Healthcare", "Reading", "Fitness", "Volunteering"]
  },
  {
    name: "Dahlia",
    email: "2019053000@student.uitm.edu.my",
    age: 21,
    gender: "Female",
    religion: "Muslim",
    contactInfo: "017-890-1234",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Art and Design",
    year: "3rd Year",
    aboutMe: {
      description: "Creative Art student who loves expressing ideas through design. I'm friendly and social, enjoy cultural activities and art exhibitions. Looking for someone who appreciates creativity and arts.",
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
    name: "Balqis",
    email: "2019164000@student.uitm.edu.my",
    age: 21,
    gender: "Female",
    religion: "Muslim",
    contactInfo: "018-901-2345",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Business and Management",
    year: "3rd Year",
    aboutMe: {
      description: "Business student with leadership qualities. Active in student organizations and enjoys networking. I'm outgoing but also serious about studies. Looking for ambitious roommate.",
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
    interests: ["Business", "Leadership", "Networking", "Events", "Entrepreneurship"]
  },
  {
    name: "Intan",
    email: "2019794000@student.uitm.edu.my",
    age: 21,
    gender: "Female",
    religion: "Muslim",
    contactInfo: "019-012-3456",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Education",
    year: "3rd Year",
    aboutMe: {
      description: "Education student passionate about teaching and child development. I'm patient, caring, and love helping others. Looking for supportive roommate who shares similar caring values.",
      studyHabits: "Early Bird",
      cleanliness: "Very Clean",
      socialLevel: "Social",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Female Only",
      roommateReligion: "Muslim Only",
      budgetRange: "RM 350-500",
      location: "Seksyen 9",
      lifestyle: "Balanced"
    },
    interests: ["Teaching", "Children", "Community Service", "Reading", "Crafts"]
  },
  {
    name: "Liyana",
    email: "2020378000@student.uitm.edu.my",
    age: 20,
    gender: "Female",
    religion: "Muslim",
    contactInfo: "012-234-5678",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Communication and Media Studies",
    year: "2nd Year",
    aboutMe: {
      description: "Communication student who loves media and storytelling. I'm creative, outgoing, and always up for trying new things. Looking for fun roommate who can be both friend and study partner.",
      studyHabits: "Flexible",
      cleanliness: "Moderate",
      socialLevel: "Very Social",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Female Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 400-600",
      location: "i-City",
      lifestyle: "Social/Active"
    },
    interests: ["Media", "Photography", "Traveling", "Movies", "Social Media"]
  },
  {
    name: "Jamilah",
    email: "2020575000@student.uitm.edu.my",
    age: 20,
    gender: "Female",
    religion: "Muslim",
    contactInfo: "013-345-6789",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Pharmacy",
    year: "2nd Year",
    aboutMe: {
      description: "Pharmacy student with passion for healthcare. I'm studious but also enjoy cultural activities. Looking for respectful roommate who maintains clean environment and appreciates different traditions.",
      studyHabits: "Early Bird",
      cleanliness: "Very Clean",
      socialLevel: "Moderate",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Female Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 450-650",
      location: "Ken Rimba",
      lifestyle: "Balanced"
    },
    interests: ["Healthcare", "Cultural Events", "Cooking", "Volunteering", "Science"]
  },
  {
    name: "Nurul",
    email: "2022325000@student.uitm.edu.my",
    age: 18,
    gender: "Female",
    religion: "Muslim",
    contactInfo: "014-456-7890",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Applied Sciences",
    year: "1st Year",
    aboutMe: {
      description: "First year Applied Sciences student interested in environmental research. I'm environmentally conscious and prefer sustainable living. Looking for like-minded roommate who cares about the environment.",
      studyHabits: "Flexible",
      cleanliness: "Very Clean",
      socialLevel: "Social",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Female Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 350-550",
      location: "Seksyen 24",
      lifestyle: "Social/Active"
    },
    interests: ["Environmental Science", "Sustainability", "Nature", "Photography", "Hiking"]
  },
  {
    name: "Lina",
    email: "2022615000@student.uitm.edu.my",
    age: 18,
    gender: "Female",
    religion: "Buddhist",
    contactInfo: "015-567-8901",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Art and Design",
    year: "1st Year",
    aboutMe: {
      description: "Creative first year Art student who loves expressing myself through various mediums. I'm open-minded and appreciate diversity. Looking for creative roommate who understands the artistic lifestyle.",
      studyHabits: "Night Owl",
      cleanliness: "Moderate",
      socialLevel: "Social",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Any Gender",
      roommateReligion: "Any Religion",
      budgetRange: "RM 300-500",
      location: "Seksyen 2",
      lifestyle: "Balanced"
    },
    interests: ["Art", "Music", "Photography", "Movies", "Yoga"]
  },
  {
    name: "Aminah",
    email: "2022888000@student.uitm.edu.my",
    age: 18,
    gender: "Female",
    religion: "Muslim",
    contactInfo: "016-678-9012",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Accountancy",
    year: "1st Year",
    aboutMe: {
      description: "First year Accounting student who's disciplined and focused on career goals. I'm organized and prefer structured living. Looking for responsible roommate who shares similar values about planning and organization.",
      studyHabits: "Early Bird",
      cleanliness: "Very Clean",
      socialLevel: "Quiet",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Female Only",
      roommateReligion: "Muslim Only",
      budgetRange: "RM 350-550",
      location: "Seksyen 25",
      lifestyle: "Quiet/Studious"
    },
    interests: ["Accounting", "Finance", "Reading", "Planning", "Islamic Studies"]
  },

  // MALE STUDENTS
  {
    name: "Yusof",
    email: "2018115000@student.uitm.edu.my",
    age: 22,
    gender: "Male",
    religion: "Muslim",
    contactInfo: "013-456-7890",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Engineering",
    year: "Final Year",
    aboutMe: {
      description: "Final year Mechanical Engineering student passionate about innovation. I enjoy working on projects and collaborating with others. Looking for motivated roommate who understands the engineering lifestyle.",
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
    interests: ["Engineering", "Technology", "Innovation", "Sports", "Teamwork"]
  },
  {
    name: "Amir",
    email: "2018173000@student.uitm.edu.my",
    age: 22,
    gender: "Male",
    religion: "Muslim",
    contactInfo: "014-567-8901",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Business and Management",
    year: "Final Year",
    aboutMe: {
      description: "Business student with entrepreneurial aspirations. Active in student organizations and enjoys networking events. Looking for ambitious roommate who shares business interests.",
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
    interests: ["Business", "Entrepreneurship", "Networking", "Leadership", "Finance"]
  },
  {
    name: "Iskandar",
    email: "2018175000@student.uitm.edu.my",
    age: 22,
    gender: "Male",
    religion: "Muslim",
    contactInfo: "015-678-9012",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Law",
    year: "Final Year",
    aboutMe: {
      description: "Law student with strong analytical skills. Enjoys debates and intellectual discussions. Prefers quiet study environment and looking for serious, studious roommate.",
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
    interests: ["Law", "Debate", "Reading", "Politics", "Research"]
  },
  {
    name: "Yahya",
    email: "2018327000@student.uitm.edu.my",
    age: 22,
    gender: "Male",
    religion: "Muslim",
    contactInfo: "016-789-0123",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Art and Design",
    year: "Final Year",
    aboutMe: {
      description: "Creative Graphic Design student who loves visual arts and digital media. Sometimes work late on creative projects. Looking for understanding roommate who appreciates creativity.",
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
  {
    name: "Khalid",
    email: "2018866000@student.uitm.edu.my",
    age: 22,
    gender: "Male",
    religion: "Muslim",
    contactInfo: "017-890-1234",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Sports Science and Recreation",
    year: "Final Year",
    aboutMe: {
      description: "Sports Science student and athlete. Train regularly and maintain healthy lifestyle. Early riser and disciplined. Looking for roommate who understands athlete lifestyle.",
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
    name: "Tariq",
    email: "2018988000@student.uitm.edu.my",
    age: 22,
    gender: "Male",
    religion: "Muslim",
    contactInfo: "018-901-2345",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Information Management",
    year: "Final Year",
    aboutMe: {
      description: "Information Management student specializing in data analytics. Tech-savvy and spend time on data projects. Looking for understanding roommate who respects irregular schedule due to project deadlines.",
      studyHabits: "Night Owl",
      cleanliness: "Clean",
      socialLevel: "Moderate",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Male Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 450-650",
      location: "Seksyen 10",
      lifestyle: "Quiet/Studious"
    },
    interests: ["Data Analytics", "Technology", "Programming", "Gaming", "Research"]
  },
  {
    name: "Hafiz",
    email: "2019019000@student.uitm.edu.my",
    age: 21,
    gender: "Male",
    religion: "Muslim",
    contactInfo: "019-012-3456",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Engineering",
    year: "3rd Year",
    aboutMe: {
      description: "Engineering student passionate about technology and innovation. Enjoy working on robotics projects. Looking for someone who understands engineering lifestyle and appreciates technology discussions.",
      studyHabits: "Night Owl",
      cleanliness: "Clean",
      socialLevel: "Moderate",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Male Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 400-600",
      location: "i-City",
      lifestyle: "Quiet/Studious"
    },
    interests: ["Engineering", "Technology", "Robotics", "Innovation", "Gaming"]
  },
  {
    name: "Rizal",
    email: "2019932000@student.uitm.edu.my",
    age: 21,
    gender: "Male",
    religion: "Muslim",
    contactInfo: "012-345-6789",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Business and Management",
    year: "3rd Year",
    aboutMe: {
      description: "Business student with interest in digital marketing and e-commerce. Social and outgoing, enjoy networking events. Looking for motivated roommate who shares business ambitions.",
      studyHabits: "Flexible",
      cleanliness: "Clean",
      socialLevel: "Very Social",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Male Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 450-650",
      location: "Setia Alam",
      lifestyle: "Social/Active"
    },
    interests: ["Business", "Digital Marketing", "E-commerce", "Networking", "Technology"]
  },
  {
    name: "Fauzi",
    email: "2020783000@student.uitm.edu.my",
    age: 20,
    gender: "Male",
    religion: "Muslim",
    contactInfo: "013-456-7890",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Accountancy",
    year: "2nd Year",
    aboutMe: {
      description: "Accounting student preparing for professional exams. Disciplined and focused on career goals. Enjoy quiet evenings and prefer organized living environment.",
      studyHabits: "Early Bird",
      cleanliness: "Very Clean",
      socialLevel: "Quiet",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Male Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 400-600",
      location: "Ken Rimba",
      lifestyle: "Quiet/Studious"
    },
    interests: ["Accounting", "Finance", "Professional Development", "Reading", "Planning"]
  },
  {
    name: "Omar",
    email: "2021282000@student.uitm.edu.my",
    age: 19,
    gender: "Male",
    religion: "Muslim",
    contactInfo: "014-567-8901",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Computer and Mathematical Sciences",
    year: "2nd Year",
    aboutMe: {
      description: "Computer Science student passionate about software development and AI. Spend time coding and learning new technologies. Looking for tech-savvy roommate who shares similar interests.",
      studyHabits: "Night Owl",
      cleanliness: "Moderate",
      socialLevel: "Moderate",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Male Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 400-600",
      location: "Seksyen 7",
      lifestyle: "Quiet/Studious"
    },
    interests: ["Programming", "Technology", "AI", "Gaming", "Software Development"]
  },
  {
    name: "Danial",
    email: "2021529000@student.uitm.edu.my",
    age: 19,
    gender: "Male",
    religion: "Muslim",
    contactInfo: "015-678-9012",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Communication and Media Studies",
    year: "2nd Year",
    aboutMe: {
      description: "Communication student interested in journalism and media production. Creative and outgoing, enjoy making videos and content creation. Looking for creative roommate who appreciates media arts.",
      studyHabits: "Flexible",
      cleanliness: "Moderate",
      socialLevel: "Very Social",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Male Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 350-550",
      location: "Seksyen 8",
      lifestyle: "Social/Active"
    },
    interests: ["Media", "Journalism", "Video Production", "Content Creation", "Photography"]
  },
  {
    name: "Syazwan",
    email: "2021970000@student.uitm.edu.my",
    age: 19,
    gender: "Male",
    religion: "Muslim",
    contactInfo: "016-789-0123",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Law",
    year: "2nd Year",
    aboutMe: {
      description: "Law student with strong analytical skills and attention to detail. Spend considerable time reading and researching. Looking for quiet, intellectual roommate who appreciates deep conversations.",
      studyHabits: "Night Owl",
      cleanliness: "Very Clean",
      socialLevel: "Quiet",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Male Only",
      roommateReligion: "Muslim Only",
      budgetRange: "RM 400-600",
      location: "Seksyen 9",
      lifestyle: "Quiet/Studious"
    },
    interests: ["Law", "Debate", "Reading", "Politics", "Research"]
  },
  {
    name: "Irfan",
    email: "2022307000@student.uitm.edu.my",
    age: 18,
    gender: "Male",
    religion: "Muslim",
    contactInfo: "017-890-1234",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Applied Sciences",
    year: "1st Year",
    aboutMe: {
      description: "First year Applied Sciences student interested in environmental research and sustainability. Environmentally conscious and prefer eco-friendly living practices. Looking for like-minded roommate.",
      studyHabits: "Early Bird",
      cleanliness: "Very Clean",
      socialLevel: "Social",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Male Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 350-550",
      location: "Seksyen 6",
      lifestyle: "Balanced"
    },
    interests: ["Environmental Science", "Sustainability", "Nature", "Research", "Outdoor Activities"]
  },
  {
    name: "Ahmad",
    email: "2023012000@student.uitm.edu.my",
    age: 17,
    gender: "Male",
    religion: "Muslim",
    contactInfo: "018-901-2345",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Engineering",
    year: "1st Year",
    aboutMe: {
      description: "First year Engineering student excited about technology and innovation. Eager to learn and collaborate with others. Looking for friendly roommate who can help with university life adjustment.",
      studyHabits: "Flexible",
      cleanliness: "Clean",
      socialLevel: "Social",
      smokingHabits: "Non-Smoker"
    },
    preferences: {
      roommateGender: "Male Only",
      roommateReligion: "Any Religion",
      budgetRange: "RM 300-500",
      location: "Seksyen 1",
      lifestyle: "Balanced"
    },
    interests: ["Engineering", "Technology", "Learning", "Sports", "Making Friends"]
  }
];

async function createAutoRoommateProfiles() {
  try {
    console.log('👥 Creating automatic roommate profiles for Find Roommate page...');
    
    // Clear existing auto-generated profiles
    await RoommateRequest.deleteMany({ source: 'Auto Generated Profile' });
    console.log('🗑️ Cleared existing auto-generated profiles');
    
    // Insert new profiles
    const profilesToInsert = userProfiles.map(profile => ({
      ...profile,
      source: 'Auto Generated Profile',
      createdAt: new Date()
    }));
    
    const result = await RoommateRequest.insertMany(profilesToInsert);
    
    console.log(`✅ Successfully created ${result.length} automatic roommate profiles!`);
    console.log('👥 Profiles include:');
    console.log('   🎯 Logical name-gender matching');
    console.log('   🧠 Realistic personalities for AI matching');
    console.log('   📚 Diverse faculties and interests');
    console.log('   🏠 Various location preferences');
    console.log('   💰 Different budget ranges');
    console.log('   🎨 Balanced lifestyle preferences');
    
    console.log('\n📊 Profile breakdown:');
    const femaleCount = result.filter(r => r.gender === 'Female').length;
    const maleCount = result.filter(r => r.gender === 'Male').length;
    console.log(`   👩 Female profiles: ${femaleCount}`);
    console.log(`   👨 Male profiles: ${maleCount}`);
    
    // Close connection
    await mongoose.disconnect();
    console.log('🔌 Database connection closed.');
    
  } catch (error) {
    console.error('❌ Error creating auto roommate profiles:', error);
    process.exit(1);
  }
}

// Run the creation
createAutoRoommateProfiles();
