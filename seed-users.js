const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Connect to your database
mongoose.connect('mongodb://localhost:27017/roomtopia', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Import the actual User model instead of defining a new schema
const User = require('./models/User');

// 🎯 REALISTIC 2025 UiTM STUDENTS - Valid matric numbers (2022-2025) with full names
const users = [
  // FINAL YEAR STUDENTS (2022 intake)
  { fullName: 'Zainab Zulia', matricNumber: '2022101234', email: '2022101234@student.uitm.edu.my' },
  { fullName: 'Yusof Rahman', matricNumber: '2022115678', email: '2022115678@student.uitm.edu.my' },
  { fullName: 'Amir Hakim', matricNumber: '2022173456', email: '2022173456@student.uitm.edu.my' },
  { fullName: 'Iskandar Zulkifli', matricNumber: '2022175890', email: '2022175890@student.uitm.edu.my' },
  { fullName: 'Qistina Amira', matricNumber: '2022187234', email: '2022187234@student.uitm.edu.my' },
  { fullName: 'Yahya Danial', matricNumber: '2022327567', email: '2022327567@student.uitm.edu.my' },

  // 3RD YEAR STUDENTS (2023 intake)
  { fullName: 'Wan Nurhaliza', matricNumber: '2023513890', email: '2023513890@student.uitm.edu.my' },
  { fullName: 'Khalid Asyraf', matricNumber: '2023866123', email: '2023866123@student.uitm.edu.my' },
  { fullName: 'Tariq Imran', matricNumber: '2023988456', email: '2023988456@student.uitm.edu.my' },
  { fullName: 'Hafiz Azman', matricNumber: '2023019789', email: '2023019789@student.uitm.edu.my' },
  { fullName: 'Dahlia Sofea', matricNumber: '2023053012', email: '2023053012@student.uitm.edu.my' },
  { fullName: 'Balqis Iman', matricNumber: '2023164345', email: '2023164345@student.uitm.edu.my' },
  { fullName: 'Intan Syahirah', matricNumber: '2023794678', email: '2023794678@student.uitm.edu.my' },
  { fullName: 'Rizal Hakimi', matricNumber: '2023932901', email: '2023932901@student.uitm.edu.my' },

  // 2ND YEAR STUDENTS (2024 intake)
  { fullName: 'Liyana Batrisyia', matricNumber: '2024378234', email: '2024378234@student.uitm.edu.my' },
  { fullName: 'Jamilah Husna', matricNumber: '2024575567', email: '2024575567@student.uitm.edu.my' },
  { fullName: 'Fauzi Irfan', matricNumber: '2024783890', email: '2024783890@student.uitm.edu.my' },
  { fullName: 'Omar Fadhil', matricNumber: '2024282123', email: '2024282123@student.uitm.edu.my' },
  { fullName: 'Danial Fikri', matricNumber: '2024529456', email: '2024529456@student.uitm.edu.my' },
  { fullName: 'Syazwan Arif', matricNumber: '2024970789', email: '2024970789@student.uitm.edu.my' },
  { fullName: 'Irfan Zikri', matricNumber: '2024307012', email: '2024307012@student.uitm.edu.my' },

  // 1ST YEAR STUDENTS (2025 intake)
  { fullName: 'Nurul Aisyah', matricNumber: '2025325345', email: '2025325345@student.uitm.edu.my' },
  { fullName: 'Lina Maisarah', matricNumber: '2025615678', email: '2025615678@student.uitm.edu.my' },
  { fullName: 'Aminah Zahra', matricNumber: '2025888901', email: '2025888901@student.uitm.edu.my' },
  { fullName: 'Ahmad Firdaus', matricNumber: '2025012234', email: '2025012234@student.uitm.edu.my' }
];

async function seedUsers() {
  try {
    console.log('🔄 Starting user seeding...');
    
    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Prepare users with hashed password
    const usersToInsert = users.map(user => ({
      ...user,
      password: hashedPassword,
      role: 'student',
      isVerified: true,
      createdAt: new Date()
    }));
    
    // Insert all users
    const result = await User.insertMany(usersToInsert);
    
    console.log(`✅ Successfully inserted ${result.length} users!`);
    console.log('📧 All users have email format: [matricNumber]@student.uitm.edu.my');
    console.log('🔑 All users have password: password123');
    console.log('🎯 Including your email: 2023866123@student.uitm.edu.my');
    
    // Close connection
    await mongoose.disconnect();
    console.log('🔌 Database connection closed.');
    
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    await mongoose.disconnect();
  }
}

// Run the seeding function
seedUsers();
