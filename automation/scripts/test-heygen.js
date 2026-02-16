#!/usr/bin/env node

/**
 * Test HeyGen API Connection
 * Verifies your API key works and shows available avatars
 */

const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.HEYGEN_API_KEY || 'sk_V2_hgu_kcEW0Z6WQBB_KZqc2yfh2dJvwvu8v5fKTaZYm2pJwYjp';
const API_URL = 'https://api.heygen.com/v2';

async function testHeyGenConnection() {
  console.log('🎬 Testing HeyGen API Connection...\n');
  
  try {
    // Test 1: Check API Key
    console.log('1️⃣ Testing API Key...');
    const response = await axios.get(`${API_URL}/avatars`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ API Key is valid!\n');
    
    // Test 2: Show Available Avatars
    console.log('2️⃣ Available Avatars:');
    if (response.data && response.data.data) {
      const avatars = response.data.data.avatars || [];
      
      if (avatars.length === 0) {
        console.log('   No avatars found. You may need to create one first.');
      } else {
        avatars.slice(0, 5).forEach((avatar, i) => {
          console.log(`   ${i + 1}. ${avatar.avatar_name} (ID: ${avatar.avatar_id})`);
        });
      }
    }
    
    console.log('\n3️⃣ Available Voices:');
    const voicesResponse = await axios.get(`${API_URL}/voices`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    if (voicesResponse.data && voicesResponse.data.data) {
      const voices = voicesResponse.data.data.voices || [];
      const englishVoices = voices.filter(v => v.language === 'English').slice(0, 5);
      
      englishVoices.forEach((voice, i) => {
        console.log(`   ${i + 1}. ${voice.voice_name} (ID: ${voice.voice_id})`);
      });
    }
    
    console.log('\n✅ HeyGen API is ready to use!\n');
    console.log('Next: Create your first video with:');
    console.log('  node scripts/test-heygen-video.js');
    
  } catch (error) {
    console.error('\n❌ API Test Failed:\n');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
      
      if (error.response.status === 401) {
        console.error('\n💡 Your API key may be invalid or expired.');
        console.error('   Get a new key from: https://app.heygen.com/settings/api');
      }
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run test
testHeyGenConnection();
