const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Connect to database
mongoose.connect('mongodb://localhost:27017/roomtopia', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 🎯 50 DIVERSE BUMIPUTERA USERS FOR EXHIBITION
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
    fullName: "Mohd Hafiz Bin Ibrahim",
    email: "2022901234@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2022901234",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Art and Design",
    course: "Bachelor of Graphic Design",
    year: "4th Year",
    bio: "Creative design student who loves visual arts and digital media. Always exploring new artistic styles.",
    contactInfo: "017-890-1234"
  },
  {
    fullName: "Nur Amira Binti Hassan",
    email: "2022012345@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2022012345",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Accountancy",
    course: "Bachelor of Accountancy",
    year: "4th Year",
    bio: "Accounting student with strong analytical skills. Preparing for professional certification exams.",
    contactInfo: "018-901-2345"
  },
  {
    fullName: "Azman Bin Sulaiman",
    email: "2022123456@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2022123456",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Sports Science and Recreation",
    course: "Bachelor of Sports Science",
    year: "4th Year",
    bio: "Sports science student and athlete. Passionate about fitness and healthy lifestyle.",
    contactInfo: "019-012-3456"
  },
  {
    fullName: "Siti Aishah Binti Mohd Ali",
    email: "2022234567@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2022234567",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Education",
    course: "Bachelor of Education",
    year: "4th Year",
    bio: "Education student passionate about teaching and child development. Love working with people.",
    contactInfo: "012-123-4567"
  },
  {
    fullName: "Khairul Anwar Bin Zainal",
    email: "2022345678@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2022345678",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Pharmacy",
    course: "Bachelor of Pharmacy",
    year: "4th Year",
    bio: "Pharmacy student interested in healthcare and pharmaceutical research. Detail-oriented and caring.",
    contactInfo: "013-234-5678"
  },

  // 2023 INTAKE - 3RD YEAR STUDENTS (Age 20-21)
  {
    fullName: "Nur Syafiqah Binti Rahman",
    email: "2023456789@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2023456789",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Computer and Mathematical Sciences",
    course: "Bachelor of Information Technology",
    year: "3rd Year",
    bio: "IT student specializing in cybersecurity. Love solving complex technical problems.",
    contactInfo: "014-345-6789"
  },
  {
    fullName: "Muhammad Haziq Bin Ismail",
    email: "2023567890@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2023567890",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Civil Engineering",
    course: "Bachelor of Civil Engineering",
    year: "3rd Year",
    bio: "Civil engineering student interested in sustainable construction and infrastructure development.",
    contactInfo: "015-456-7890"
  },
  {
    fullName: "Nur Fatin Binti Kamal",
    email: "2023678901@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2023678901",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Dentistry",
    course: "Bachelor of Dental Surgery",
    year: "3rd Year",
    bio: "Dental student committed to oral healthcare. Precise and compassionate in patient care.",
    contactInfo: "016-567-8901"
  },
  {
    fullName: "Ahmad Syafiq Bin Othman",
    email: "2023789012@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2023789012",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Business and Management",
    course: "Bachelor of Marketing",
    year: "3rd Year",
    bio: "Marketing student with creative mindset. Love developing innovative marketing strategies.",
    contactInfo: "017-678-9012"
  },
  {
    fullName: "Siti Zaleha Binti Mahmud",
    email: "2023890123@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2023890123",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Communication and Media Studies",
    course: "Bachelor of Mass Communication",
    year: "3rd Year",
    bio: "Mass comm student passionate about journalism and media production. Love storytelling.",
    contactInfo: "018-789-0123"
  },
  {
    fullName: "Mohd Aiman Bin Rosli",
    email: "2023901234@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2023901234",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Architecture, Planning and Surveying",
    course: "Bachelor of Architecture",
    year: "3rd Year",
    bio: "Architecture student with passion for sustainable design. Love creating functional and beautiful spaces.",
    contactInfo: "019-890-1234"
  },
  {
    fullName: "Nur Hidayah Binti Aziz",
    email: "2023012345@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2023012345",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Health Sciences",
    course: "Bachelor of Nursing",
    year: "3rd Year",
    bio: "Nursing student dedicated to patient care. Compassionate and hardworking in healthcare settings.",
    contactInfo: "012-901-2345"
  },
  {
    fullName: "Zulkifli Bin Ahmad",
    email: "2023123456@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2023123456",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Chemical Engineering",
    course: "Bachelor of Chemical Engineering",
    year: "3rd Year",
    bio: "Chemical engineering student interested in process optimization and environmental sustainability.",
    contactInfo: "013-012-3456"
  },
  {
    fullName: "Faridah Binti Mansor",
    email: "2023234567@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2023234567",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Applied Sciences",
    course: "Bachelor of Science in Biology",
    year: "3rd Year",
    bio: "Biology student passionate about research and environmental conservation. Love nature and wildlife.",
    contactInfo: "014-123-4567"
  },
  {
    fullName: "Mohd Irfan Bin Hashim",
    email: "2023345678@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2023345678",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Electrical Engineering",
    course: "Bachelor of Electrical Engineering",
    year: "3rd Year",
    bio: "Electrical engineering student specializing in renewable energy systems. Tech enthusiast.",
    contactInfo: "015-234-5678"
  },

  // 2024 INTAKE - 2ND YEAR STUDENTS (Age 19-20)
  {
    fullName: "Nur Balqis Binti Razak",
    email: "2024456789@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2024456789",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Computer and Mathematical Sciences",
    course: "Bachelor of Data Science",
    year: "2nd Year",
    bio: "Data science student passionate about analytics and machine learning. Love working with big data.",
    contactInfo: "016-345-6789"
  },
  {
    fullName: "Muhammad Hakim Bin Salleh",
    email: "2024567890@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2024567890",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Mechanical Engineering",
    course: "Bachelor of Mechanical Engineering",
    year: "2nd Year",
    bio: "Mechanical engineering student interested in automotive technology and robotics.",
    contactInfo: "017-456-7890"
  },
  {
    fullName: "Siti Khadijah Binti Yusuf",
    email: "2024678901@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2024678901",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Pharmacy",
    course: "Bachelor of Pharmacy",
    year: "2nd Year",
    bio: "Pharmacy student interested in clinical pharmacy and patient counseling. Detail-oriented and caring.",
    contactInfo: "018-567-8901"
  },
  {
    fullName: "Ahmad Zikri Bin Hamid",
    email: "2024789012@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2024789012",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Business and Management",
    course: "Bachelor of Human Resource Management",
    year: "2nd Year",
    bio: "HRM student passionate about people development and organizational psychology.",
    contactInfo: "019-678-9012"
  },
  {
    fullName: "Nur Syazwani Binti Bakar",
    email: "2024890123@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2024890123",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Art and Design",
    course: "Bachelor of Fine Arts",
    year: "2nd Year",
    bio: "Fine arts student specializing in digital art and illustration. Creative and imaginative.",
    contactInfo: "012-789-0123"
  },
  {
    fullName: "Mohd Fikri Bin Nasir",
    email: "2024901234@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2024901234",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Law",
    course: "Bachelor of Legal Studies",
    year: "2nd Year",
    bio: "Law student interested in corporate law and legal research. Analytical and detail-oriented.",
    contactInfo: "013-890-1234"
  },
  {
    fullName: "Nur Izzati Binti Wahab",
    email: "2024012345@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2024012345",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Medicine",
    course: "Bachelor of Medicine",
    year: "2nd Year",
    bio: "Medical student dedicated to becoming a pediatrician. Compassionate and hardworking.",
    contactInfo: "014-901-2345"
  },
  {
    fullName: "Azrul Bin Mokhtar",
    email: "2024123456@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2024123456",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Sports Science and Recreation",
    course: "Bachelor of Sports Management",
    year: "2nd Year",
    bio: "Sports management student and former athlete. Passionate about sports development and coaching.",
    contactInfo: "015-012-3456"
  },
  {
    fullName: "Siti Mariam Binti Daud",
    email: "2024234567@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2024234567",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Education",
    course: "Bachelor of Teaching (Mathematics)",
    year: "2nd Year",
    bio: "Education student specializing in mathematics teaching. Love helping students understand complex concepts.",
    contactInfo: "016-123-4567"
  },
  {
    fullName: "Mohd Faiz Bin Samad",
    email: "2024345678@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2024345678",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Accountancy",
    course: "Bachelor of Accountancy",
    year: "2nd Year",
    bio: "Accounting student with strong analytical skills. Interested in forensic accounting and auditing.",
    contactInfo: "017-234-5678"
  },

  // 2025 INTAKE - 1ST YEAR STUDENTS (Age 18-19)
  {
    fullName: "Nur Amirah Binti Halim",
    email: "2025456789@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2025456789",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Computer and Mathematical Sciences",
    course: "Bachelor of Computer Science",
    year: "1st Year",
    bio: "First-year CS student excited about programming and software development. Eager to learn new technologies.",
    contactInfo: "018-345-6789"
  },
  {
    fullName: "Muhammad Arif Bin Latif",
    email: "2025567890@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2025567890",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Engineering",
    course: "Bachelor of Civil Engineering",
    year: "1st Year",
    bio: "Civil engineering freshman passionate about infrastructure development and urban planning.",
    contactInfo: "019-456-7890"
  },
  {
    fullName: "Siti Nabila Binti Ramli",
    email: "2025678901@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2025678901",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Business and Management",
    course: "Bachelor of Business Administration",
    year: "1st Year",
    bio: "Business freshman with entrepreneurial dreams. Love learning about business strategies and innovation.",
    contactInfo: "012-567-8901"
  },
  {
    fullName: "Ahmad Luqman Bin Noor",
    email: "2025789012@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2025789012",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Art and Design",
    course: "Bachelor of Graphic Design",
    year: "1st Year",
    bio: "Graphic design freshman passionate about visual communication and branding. Creative and artistic.",
    contactInfo: "013-678-9012"
  },
  {
    fullName: "Nur Sofea Binti Jamal",
    email: "2025890123@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2025890123",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Health Sciences",
    course: "Bachelor of Nursing",
    year: "1st Year",
    bio: "Nursing freshman dedicated to healthcare and patient care. Compassionate and eager to help others.",
    contactInfo: "014-789-0123"
  },

  // SABAHAN NAMES - Mixed Years
  {
    fullName: "Dayang Nurhaliza Binti Awang",
    email: "2025901234@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2025901234",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Communication and Media Studies",
    course: "Bachelor of Mass Communication",
    year: "1st Year",
    bio: "Sabahan student passionate about media and storytelling. Love documenting cultural heritage.",
    contactInfo: "015-890-1234"
  },
  {
    fullName: "Mohd Azlan Bin Damit",
    email: "2024456123@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2024456123",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Applied Sciences",
    course: "Bachelor of Environmental Science",
    year: "2nd Year",
    bio: "Environmental science student from Sabah. Passionate about rainforest conservation and biodiversity.",
    contactInfo: "016-901-2345"
  },
  {
    fullName: "Siti Rohani Binti Majid",
    email: "2023456123@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2023456123",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Hotel and Tourism Management",
    course: "Bachelor of Hotel Management",
    year: "3rd Year",
    bio: "Tourism student from Sabah. Want to promote eco-tourism and cultural tourism in Borneo.",
    contactInfo: "017-012-3456"
  },
  {
    fullName: "Jeffry Bin Mojuntin",
    email: "2022456123@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2022456123",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Forestry",
    course: "Bachelor of Forestry Science",
    year: "4th Year",
    bio: "Forestry student from Sabah. Dedicated to sustainable forest management and wildlife conservation.",
    contactInfo: "018-123-4567"
  },
  {
    fullName: "Dayang Siti Binti Haji Omar",
    email: "2025012789@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2025012789",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Music",
    course: "Bachelor of Music",
    year: "1st Year",
    bio: "Music student from Sabah. Specializing in traditional Sabahan music and modern composition.",
    contactInfo: "019-234-5678"
  },

  // SARAWAKIAN NAMES - Mixed Years
  {
    fullName: "Anak Jelani Bin Entap",
    email: "2024567123@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2024567123",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Plantation and Agrotechnology",
    course: "Bachelor of Agricultural Science",
    year: "2nd Year",
    bio: "Agricultural science student from Sarawak. Interested in sustainable farming and crop research.",
    contactInfo: "012-345-6789"
  },
  {
    fullName: "Dayang Nurul Binti Abang Johari",
    email: "2023567123@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2023567123",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Social Sciences and Humanities",
    course: "Bachelor of Anthropology",
    year: "3rd Year",
    bio: "Anthropology student from Sarawak. Passionate about preserving indigenous cultures and languages.",
    contactInfo: "013-456-7890"
  },
  {
    fullName: "Anak Bujang Bin Nuing",
    email: "2022567123@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2022567123",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Fisheries and Food Science",
    course: "Bachelor of Aquaculture",
    year: "4th Year",
    bio: "Aquaculture student from Sarawak. Focused on sustainable fish farming and marine conservation.",
    contactInfo: "014-567-8901"
  },
  {
    fullName: "Siti Mariah Binti Awang Besar",
    email: "2025123789@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2025123789",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Information Management",
    course: "Bachelor of Information Science",
    year: "1st Year",
    bio: "Information science freshman from Sarawak. Interested in digital libraries and knowledge management.",
    contactInfo: "015-678-9012"
  },
  {
    fullName: "Anak Empiang Bin Nyabong",
    email: "2024678123@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2024678123",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Administrative Science and Policy Studies",
    course: "Bachelor of Public Administration",
    year: "2nd Year",
    bio: "Public administration student from Sarawak. Passionate about rural development and governance.",
    contactInfo: "016-789-0123"
  },

  // MORE PENINSULAR MALAYSIAN BUMIPUTERA NAMES
  {
    fullName: "Nur Insyirah Binti Mohd Zain",
    email: "2023678123@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2023678123",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Dentistry",
    course: "Bachelor of Dental Surgery",
    year: "3rd Year",
    bio: "Dental student passionate about oral health education and community service.",
    contactInfo: "017-890-1234"
  },
  {
    fullName: "Muhammad Haikal Bin Roslan",
    email: "2022678123@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2022678123",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Electrical Engineering",
    course: "Bachelor of Electrical Engineering",
    year: "4th Year",
    bio: "Electrical engineering student specializing in power systems and renewable energy.",
    contactInfo: "018-901-2345"
  },
  {
    fullName: "Nur Qistina Binti Shaharuddin",
    email: "2025234789@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2025234789",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Chemical Engineering",
    course: "Bachelor of Chemical Engineering",
    year: "1st Year",
    bio: "Chemical engineering freshman interested in process optimization and environmental sustainability.",
    contactInfo: "019-012-3456"
  },
  {
    fullName: "Ahmad Mukhriz Bin Shafie",
    email: "2024789123@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2024789123",
    gender: "Male",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Architecture, Planning and Surveying",
    course: "Bachelor of Quantity Surveying",
    year: "2nd Year",
    bio: "Quantity surveying student interested in construction management and cost estimation.",
    contactInfo: "012-123-4567"
  },
  {
    fullName: "Siti Nur Aisyah Binti Razali",
    email: "2023789123@student.uitm.edu.my",
    password: "password123",
    matricNumber: "2023789123",
    gender: "Female",
    university: "UiTM Shah Alam",
    faculty: "Faculty of Applied Sciences",
    course: "Bachelor of Science in Chemistry",
    year: "3rd Year",
    bio: "Chemistry student passionate about research and pharmaceutical development.",
    contactInfo: "013-234-5678"
  }
];

async function create50ExhibitionUsers() {
  try {
    console.log('🎯 Creating 50 diverse Bumiputera users for exhibition...');
    console.log(`📊 Total users to create: ${exhibitionUsers.length}`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const userData of exhibitionUsers) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ 
          $or: [{ email: userData.email }, { matricNumber: userData.matricNumber }] 
        });
        
        if (existingUser) {
          console.log(`⚠️ User already exists: ${userData.email}`);
          continue;
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        // Create user with hashed password
        const user = new User({
          ...userData,
          password: hashedPassword,
          role: 'student',
          dreamHomes: []
        });
        
        await user.save();
        successCount++;
        console.log(`✅ Created user: ${userData.fullName} (${userData.email})`);
        
      } catch (userError) {
        errorCount++;
        console.error(`❌ Error creating user ${userData.email}:`, userError.message);
      }
    }
    
    console.log(`\n🎉 Exhibition users creation completed!`);
    console.log(`✅ Successfully created: ${successCount} users`);
    console.log(`❌ Errors: ${errorCount} users`);
    console.log(`📊 Total attempted: ${exhibitionUsers.length} users`);
    
    // Close connection
    await mongoose.disconnect();
    console.log('🔌 Database connection closed.');
    
  } catch (error) {
    console.error('❌ Error in exhibition user creation:', error);
    process.exit(1);
  }
}

// Run the creation
create50ExhibitionUsers();
