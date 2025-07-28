// Test if auto-fetch profile pictures is working
const axios = require('axios');

async function testAutoFetch() {
  try {
    console.log('🧪 Testing auto-fetch profile pictures...');
    
    const response = await axios.get('http://localhost:3001/api/roommate-requests');
    const requests = response.data.data;
    
    console.log(`📊 Found ${requests.length} roommate requests`);
    
    // Find Rees Danial
    const reesDanial = requests.find(r => r.name.includes('Rees') && r.name.includes('Danial'));
    
    if (reesDanial) {
      console.log('\n🎯 Found Rees Danial:');
      console.log('Name:', reesDanial.name);
      console.log('Email:', reesDanial.userEmail);
      console.log('Profile Picture:', reesDanial.profilePicture);
      
      if (reesDanial.profilePicture) {
        console.log('✅ AUTO-FETCH WORKING! Profile picture is being fetched automatically');
      } else {
        console.log('❌ AUTO-FETCH NOT WORKING! No profile picture found');
      }
    } else {
      console.log('❌ Rees Danial not found in roommate requests');
    }
    
    // Check a few more users
    console.log('\n📋 Sample of other users:');
    requests.slice(0, 5).forEach(request => {
      console.log(`${request.name} (${request.userEmail}): ${request.profilePicture ? '✅ HAS PICTURE' : '❌ NO PICTURE'}`);
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAutoFetch();
