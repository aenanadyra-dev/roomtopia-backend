const axios = require('axios');

async function testPropertyAPI() {
  try {
    console.log('🧪 Testing Property API endpoint...');
    
    const response = await axios.get('http://localhost:3001/api/properties');
    
    console.log('📊 API Response Status:', response.status);
    console.log('📊 API Response Success:', response.data.success);
    console.log('📊 Number of properties returned:', response.data.data?.length || 0);
    
    if (response.data.data && response.data.data.length > 0) {
      console.log('\n🏠 Sample properties:');
      response.data.data.slice(0, 3).forEach((property, index) => {
        console.log(`  ${index + 1}. ${property.title}`);
        console.log(`     📍 Location: ${property.location}`);
        console.log(`     💰 Price: RM ${property.price}`);
        console.log(`     🏷️ Type: ${property.type}`);
        console.log(`     👥 Gender Pref: ${property.preferredGender || 'Any'}`);
        console.log(`     🕌 Religious Pref: ${property.religiousPreference || 'Any'}`);
        console.log(`     🚬 Smoking Pref: ${property.smokingPreference || 'Any'}`);
        console.log('');
      });
      
      // Check AI matching fields
      const propertiesWithAI = response.data.data.filter(p => 
        p.preferredGender || p.religiousPreference || p.smokingPreference
      );
      
      console.log(`🤖 Properties with AI matching fields: ${propertiesWithAI.length}/${response.data.data.length}`);
      
      // Check property types
      const types = [...new Set(response.data.data.map(p => p.type))];
      console.log(`🏷️ Property types available: ${types.join(', ')}`);
      
      // Check locations
      const locations = [...new Set(response.data.data.map(p => p.location))];
      console.log(`📍 Locations available: ${locations.join(', ')}`);
      
    } else {
      console.log('❌ No properties returned from API');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    if (error.response) {
      console.error('📊 Response status:', error.response.status);
      console.error('📊 Response data:', error.response.data);
    }
  }
}

// Run the test
testPropertyAPI();
