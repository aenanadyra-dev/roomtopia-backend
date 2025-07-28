const mongoose = require('mongoose');
const { spawn } = require('child_process');
const path = require('path');

// Connect to database
mongoose.connect('mongodb://localhost:27017/roomtopia', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Function to run a script and return a promise
function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Running ${scriptName}...`);
    
    const scriptPath = path.join(__dirname, scriptName);
    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${scriptName} completed successfully`);
        resolve();
      } else {
        console.error(`❌ ${scriptName} failed with code ${code}`);
        reject(new Error(`${scriptName} failed`));
      }
    });
    
    child.on('error', (error) => {
      console.error(`❌ Error running ${scriptName}:`, error);
      reject(error);
    });
  });
}

async function seedAllExhibitionData() {
  try {
    console.log('🎯 ROOMTOPIA EXHIBITION DATA SEEDING');
    console.log('=====================================');
    console.log('This will populate your database with comprehensive demo data for exhibition day!');
    console.log('');
    
    const startTime = new Date();
    
    // Step 1: Seed Users (if not already done)
    console.log('📋 STEP 1: Setting up users...');
    try {
      await runScript('seed-users.js');
    } catch (error) {
      console.log('ℹ️ Users might already exist, continuing...');
    }
    
    // Step 2: Create Admin Users
    console.log('\n📋 STEP 2: Setting up admin users...');
    try {
      await runScript('createAdmin.js');
    } catch (error) {
      console.log('ℹ️ Admin users might already exist, continuing...');
    }
    
    // Step 3: Enhance User Profiles
    console.log('\n📋 STEP 3: Enhancing user profiles for AI matching...');
    await runScript('enhanceUserProfiles.js');
    
    // Step 4: Seed Property Listings
    console.log('\n📋 STEP 4: Creating property listings...');
    await runScript('seedProperties.js');
    
    // Step 5: Create Realistic 2025 Roommate Profiles
    console.log('\n📋 STEP 5: Creating realistic 2025 UiTM student profiles...');
    await runScript('createRealistic2025Profiles.js');

    // Step 6: Seed Additional Roommate Requests
    console.log('\n📋 STEP 6: Creating additional roommate requests...');
    await runScript('seedRoommateRequests.js');
    
    // Step 7: Seed Analytics Data
    console.log('\n📋 STEP 7: Generating analytics data...');
    await runScript('seedAnalytics.js');
    
    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000);
    
    console.log('\n🎉 EXHIBITION DATA SEEDING COMPLETE!');
    console.log('=====================================');
    console.log(`⏱️ Total time: ${duration} seconds`);
    console.log('');
    console.log('📊 Your database now contains:');
    console.log('   👥 25 realistic 2025 UiTM students (valid matric numbers)');
    console.log('   🏠 15+ realistic property listings with photos');
    console.log('   🤝 10+ realistic 2025 roommate profiles (logical names)');
    console.log('   👫 13+ additional diverse roommate requests');
    console.log('   📈 30 days of analytics data');
    console.log('   🔐 Admin accounts for demonstration');
    console.log('');
    console.log('🚀 READY FOR EXHIBITION!');
    console.log('');
    console.log('📝 Login credentials for demo:');
    console.log('   👨‍💼 Admin: admin@roomtopia.com / admin123');
    console.log('   👩‍🏫 Supervisor: supervisor@uitm.edu.my / admin123');
    console.log('   👨‍🎓 Student: 2018101000@student.uitm.edu.my / password123');
    console.log('   👩‍🎓 Student: 2019019000@student.uitm.edu.my / password123');
    console.log('   (All student accounts use password: password123)');
    console.log('');
    console.log('🎯 Exhibition Features Ready:');
    console.log('   ✅ AI-powered roommate matching');
    console.log('   ✅ Property search and filtering');
    console.log('   ✅ Real-time analytics dashboard');
    console.log('   ✅ Bookmark/favorites system');
    console.log('   ✅ User profile management');
    console.log('   ✅ Admin panel with user management');
    console.log('');
    console.log('💡 Pro Tips for Exhibition:');
    console.log('   🔍 Search for "Seksyen 7" to see popular properties');
    console.log('   🤖 Try AI matching with different preferences');
    console.log('   📊 Check analytics for trending locations');
    console.log('   ⭐ Test bookmark functionality');
    console.log('   👥 Browse diverse roommate profiles');
    console.log('');
    console.log('🎊 Good luck with your exhibition!');
    
  } catch (error) {
    console.error('\n❌ SEEDING FAILED:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure MongoDB is running');
    console.log('   2. Check database connection string');
    console.log('   3. Ensure all model files exist');
    console.log('   4. Try running individual scripts manually');
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database connection closed.');
  }
}

// Handle script interruption
process.on('SIGINT', async () => {
  console.log('\n⚠️ Seeding interrupted by user');
  await mongoose.disconnect();
  process.exit(0);
});

// Run the master seeding
seedAllExhibitionData();
