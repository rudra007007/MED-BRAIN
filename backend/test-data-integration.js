#!/usr/bin/env node

/**
 * Test all new endpoints and data integration
 * Run: node test-data-integration.js
 */

let axios;
try {
  axios = require('axios');
} catch (e) {
  console.error('❌ axios not found. Install with: npm install axios');
  process.exit(1);
}

const BASE_URL = 'http://127.0.0.1:3000/api';
const userId = 'default-user';

console.log('🧪 Testing MED-BRAIN Data Integration\n');
console.log('Make sure backend is running on port 3000\n');
console.log('─'.repeat(60));

async function testHealthData() {
  console.log('\n1️⃣  Testing Health Data Endpoints...');
  try {
    const response = await axios.get(`${BASE_URL}/health/data/${userId}`, {
      timeout: 5000
    });
    
    if (response.data.success && response.data.data.length > 0) {
      console.log('✅ Health Data: SUCCESS');
      console.log(`   Found ${response.data.data.length} data points`);
      console.log(`   Latest: ${JSON.stringify(response.data.data[0]).substring(0, 60)}...`);
    } else {
      console.log('❌ Health Data: No data found');
    }
  } catch (error) {
    console.log('❌ Health Data: ERROR');
    if (error.code === 'ECONNREFUSED') {
      console.log('   Backend not running on port 3000');
    } else if (error.response) {
      console.log(`   HTTP ${error.response.status}: ${error.response.statusText}`);
    } else {
      console.log('   ', error.message || 'Unknown error');
    }
  }
}

async function testPatternInsights() {
  console.log('\n2️⃣  Testing Pattern Insights...');
  try {
    const response = await axios.get(`${BASE_URL}/insights/${userId}`, {
      timeout: 5000
    });
    
    if (response.data.success && response.data.data.length > 0) {
      console.log('✅ Pattern Insights: SUCCESS');
      console.log(`   Found ${response.data.data.length} insights`);
      console.log(`   First insight: "${response.data.data[0].title}"`);
      console.log(`   Risk change: +${response.data.data[0].riskChange}%`);
    } else {
      console.log('❌ Pattern Insights: No insights found');
    }
  } catch (error) {
    console.log('❌ Pattern Insights: ERROR');
    if (error.code === 'ECONNREFUSED') {
      console.log('   Backend not running on port 3000');
    } else if (error.response) {
      console.log(`   HTTP ${error.response.status}: ${error.response.statusText}`);
    } else {
      console.log('   ', error.message || 'Unknown error');
    }
  }
}

async function testCommunityTrends() {
  console.log('\n3️⃣  Testing Community Trends...');
  try {
    const response = await axios.get(`${BASE_URL}/community/trends`, {
      timeout: 5000
    });
    
    if (response.data.success && response.data.data.length > 0) {
      console.log('✅ Community Trends: SUCCESS');
      console.log(`   Found ${response.data.data.length} trends`);
      console.log(`   Categories: ${response.data.data.map(t => t.category).join(', ')}`);
    } else {
      console.log('❌ Community Trends: No trends found');
    }
  } catch (error) {
    console.log('❌ Community Trends: ERROR');
    if (error.code === 'ECONNREFUSED') {
      console.log('   Backend not running on port 3000');
    } else if (error.response) {
      console.log(`   HTTP ${error.response.status}: ${error.response.statusText}`);
    } else {
      console.log('   ', error.message || 'Unknown error');
    }
  }
}

async function testSymptomHistory() {
  console.log('\n4️⃣  Testing Symptom History...');
  try {
    // First extract symptoms to create history
    await axios.post(`${BASE_URL}/symptoms/extract`, {
      text: 'I have a headache and feel dizzy',
      userId
    }, { timeout: 5000 });
    
    // Then get history
    const response = await axios.get(`${BASE_URL}/insights/symptom-history/${userId}`, {
      timeout: 5000
    });
    
    if (response.data.success) {
      console.log('✅ Symptom History: SUCCESS');
      console.log(`   Found ${response.data.data.length} history entries`);
      if (response.data.data.length > 0) {
        console.log(`   Latest: ${response.data.data[0].symptoms.length} symptoms extracted`);
      }
    } else {
      console.log('❌ Symptom History: Failed');
    }
  } catch (error) {
    console.log('❌ Symptom History: ERROR');
    if (error.code === 'ECONNREFUSED') {
      console.log('   Backend not running on port 3000');
    } else if (error.response) {
      console.log(`   HTTP ${error.response.status}: ${error.response.statusText}`);
    } else {
      console.log('   ', error.message || 'Unknown error');
    }
  }
}

async function testStoreAndRetrieve() {
  console.log('\n5️⃣  Testing Data Storage...');
  try {
    // Store new health data
    const newData = {
      date: new Date().toISOString().split('T')[0],
      steps: 7500,
      sleep_hours: 7.0,
      heart_rate: 72
    };
    
    await axios.post(`${BASE_URL}/health/data`, {
      userId: 'test-user',
      data: [newData]
    }, { timeout: 5000 });
    
    // Retrieve it
    const response = await axios.get(`${BASE_URL}/health/data/test-user`, {
      timeout: 5000
    });
    
    if (response.data.success && response.data.data.length > 0) {
      console.log('✅ Data Storage: SUCCESS');
      console.log('   Data stored and retrieved successfully');
    } else {
      console.log('❌ Data Storage: Failed to retrieve stored data');
    }
  } catch (error) {
    console.log('❌ Data Storage: ERROR');
    if (error.code === 'ECONNREFUSED') {
      console.log('   Backend not running on port 3000');
    } else if (error.response) {
      console.log(`   HTTP ${error.response.status}: ${error.response.statusText}`);
    } else {
      console.log('   ', error.message || 'Unknown error');
    }
  }
}

async function runTests() {
  console.log('\nStarting data integration tests...\n');

  await testHealthData();
  await testPatternInsights();
  await testCommunityTrends();
  await testSymptomHistory();
  await testStoreAndRetrieve();

  console.log('\n' + '─'.repeat(60));
  console.log('\n✨ Data integration test complete!\n');
  console.log('Next: Start your mobile app and see real data from backend!\n');
}

runTests().catch(error => {
  console.error('\n💥 Fatal error:', error.message);
  console.log('\nMake sure:');
  console.log('1. Backend is running: cd backend && npm run dev');
  console.log('2. Port 3000 is available');
  console.log('3. All dependencies installed\n');
  process.exit(1);
});
