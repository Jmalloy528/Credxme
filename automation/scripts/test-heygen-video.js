#!/usr/bin/env node

/**
 * Generate Test Video with HeyGen
 * Creates your first CredX video using HeyGen API
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const API_KEY = process.env.HEYGEN_API_KEY || 'sk_V2_hgu_kcEW0Z6WQBB_KZqc2yfh2dJvwvu8v5fKTaZYm2pJwYjp';
const API_URL = 'https://api.heygen.com/v2';

// Video configuration
const VIDEO_CONFIG = {
  // Using a default avatar - you'll want to create a custom one
  avatar_id: 'Daisy-inskirt-20220818',  // Professional female avatar
  voice_id: 'en-US-JennyNeural',        // Professional voice
  
  // The script from your first video
  script: "Credit Karma is lying to you. They tell you your score is 720, but when you go to buy a house, the bank says it's 680. Here's why: Credit Karma uses VantageScore 3.0. Banks use FICO Score 2. That's a 20 to 50 point difference. Don't trust Credit Karma for mortgages! Get my free credit score guide. Link in bio.",
  
  // Background settings
  background: {
    type: 'color',
    value: '#2563eb'  // CredX blue
  },
  
  // Video dimensions (9:16 for Shorts/Reels)
  dimension: {
    width: 1080,
    height: 1920
  },
  
  // Captions
  caption: true
};

async function generateVideo() {
  console.log('🎬 Generating Your First CredX Video\n');
  console.log('This may take 2-5 minutes...\n');
  
  try {
    // Step 1: Create video
    console.log('1️⃣ Submitting video request...');
    
    const createResponse = await axios.post(
      `${API_URL}/video/generate`,
      VIDEO_CONFIG,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'X-Api-Key': API_KEY
        }
      }
    );
    
    const videoId = createResponse.data.data.video_id;
    console.log(`✅ Video created! ID: ${videoId}\n`);
    
    // Step 2: Poll for completion
    console.log('2️⃣ Waiting for video to render...');
    console.log('   (This takes 2-5 minutes)\n');
    
    let videoUrl = null;
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts && !videoUrl) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      attempts++;
      
      process.stdout.write(`   Checking... attempt ${attempts}/${maxAttempts}\r`);
      
      try {
        const statusResponse = await axios.get(
          `${API_URL}/video/status?video_id=${videoId}`,
          {
            headers: {
              'Authorization': `Bearer ${API_KEY}`,
              'X-Api-Key': API_KEY
            }
          }
        );
        
        const status = statusResponse.data.data.status;
        
        if (status === 'completed') {
          videoUrl = statusResponse.data.data.video_url;
          console.log(`\n✅ Video is ready!\n`);
        } else if (status === 'failed') {
          throw new Error('Video generation failed: ' + statusResponse.data.data.error);
        }
        
      } catch (error) {
        // Continue polling
      }
    }
    
    if (!videoUrl) {
      throw new Error('Video generation timed out');
    }
    
    // Step 3: Download video
    console.log('3️⃣ Downloading video...\n');
    
    const videosDir = path.join(__dirname, '..', 'videos');
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true });
    }
    
    const videoPath = path.join(videosDir, `credx-video-${Date.now()}.mp4`);
    
    const videoResponse = await axios({
      method: 'GET',
      url: videoUrl,
      responseType: 'stream'
    });
    
    const writer = fs.createWriteStream(videoPath);
    videoResponse.data.pipe(writer);
    
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    
    console.log('✅ Video saved!\n');
    console.log('========================================');
    console.log('🎉 SUCCESS! Your video is ready:');
    console.log('========================================');
    console.log(`File: ${videoPath}`);
    console.log(`Video ID: ${videoId}`);
    console.log(`Video URL: ${videoUrl}`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Download the video from the URL above');
    console.log('2. Upload to YouTube Shorts, TikTok, and Instagram Reels');
    console.log('3. Check the automation dashboard: http://localhost:3002');
    console.log('========================================\n');
    
    // Save video info
    const infoPath = path.join(videosDir, 'video-info.txt');
    fs.writeFileSync(infoPath, `
CredX Video Generated: ${new Date().toISOString()}
Video ID: ${videoId}
Video URL: ${videoUrl}
Local Path: ${videoPath}
Script: ${VIDEO_CONFIG.script}
`);
    
  } catch (error) {
    console.error('\n❌ Video Generation Failed:\n');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.error('\n💡 API Key issue. Check your HeyGen API key.');
      } else if (error.response.status === 400) {
        console.error('\n💡 Request format issue. Check avatar_id and voice_id.');
      }
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run
generateVideo();
