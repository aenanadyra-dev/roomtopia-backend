const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('🔍 Testing analytics API endpoint...');
    
    const response = await fetch('http://localhost:3001/api/analytics/dashboard');
    console.log('📡 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:', JSON.stringify(data, null, 2));
      console.log('🔍 Roommate preferences:', data.roommatePreferences);
    } else {
      console.log('❌ API Error:', response.statusText);
      const errorText = await response.text();
      console.log('❌ Error details:', errorText);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testAPI();
