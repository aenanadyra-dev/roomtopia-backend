const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Connect to MongoDB (remove deprecated options)
mongoose.connect('mongodb://localhost:27017/roomtopia')
.then(() => console.log('✅ Connected to MongoDB for admin creation'))
.catch(err => console.error('❌ MongoDB connection error:', err));

const createAdminUsers = async () => {
  try {
    console.log('🔍 Checking for existing admin users...');
    
    // Check if admin already exists
    const existingMainAdmin = await User.findOne({ email: 'admin@roomtopia.com' });
    const existingSupervisorAdmin = await User.findOne({ email: 'supervisor@uitm.edu.my' });
    
    if (existingMainAdmin && existingSupervisorAdmin) {
      console.log('✅ Admin users already exist!');
      console.log('📧 admin@roomtopia.com / admin123');
      console.log('📧 supervisor@uitm.edu.my / admin123');
      process.exit(0);
    }

    // Create main admin if doesn't exist
    if (!existingMainAdmin) {
      const mainAdmin = new User({
        fullName: 'Roomtopia Administrator',
        email: 'admin@roomtopia.com',
        password: 'admin123',
        role: 'admin',
        adminLevel: 'super',
        contactInfo: '+60123456789',
        isActive: true
        // Note: No matricNumber for admin users (will be null/undefined)
      });
      await mainAdmin.save();
      console.log('✅ Main admin created: admin@roomtopia.com');
    } else {
      console.log('ℹ️ Main admin already exists');
    }

    // Create supervisor admin if doesn't exist
    if (!existingSupervisorAdmin) {
      const supervisorAdmin = new User({
        fullName: 'FYP Supervisor',
        email: 'supervisor@uitm.edu.my',
        password: 'admin123',
        role: 'admin',
        adminLevel: 'super',
        contactInfo: '+60987654321',
        isActive: true
        // Note: No matricNumber for admin users (will be null/undefined)
      });
      await supervisorAdmin.save();
      console.log('✅ Supervisor admin created: supervisor@uitm.edu.my');
    } else {
      console.log('ℹ️ Supervisor admin already exists');
    }

    console.log('\n🎉 Admin setup complete!');
    console.log('📧 Login credentials:');
    console.log('   admin@roomtopia.com / admin123');
    console.log('   supervisor@uitm.edu.my / admin123');
    console.log('\n🚀 You can now start your server and test admin login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin users:', error);
    
    if (error.code === 11000) {
      console.log('ℹ️ This might be a duplicate key error.');
      console.log('💡 Try dropping the matricNumber index first:');
      console.log('   1. Open MongoDB Compass');
      console.log('   2. Go to roomtopia > users > Indexes');
      console.log('   3. Delete the "matricNumber_1" index');
      console.log('   4. Run this script again');
    }
    
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Admin creation process interrupted');
  mongoose.connection.close();
  process.exit(0);
});

createAdminUsers();
