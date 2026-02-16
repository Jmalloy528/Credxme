const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
require('dotenv').config();

// HeyGen API Configuration
const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const HEYGEN_API_URL = 'https://api.heygen.com/v1';

// Avatar and voice settings
const AVATAR_CONFIG = {
  avatar_id: ' cartoon_elephant_v1', // You'll need to find actual HeyGen avatar ID
  voice_id: 'en-US-JennyNeural', // Professional female voice
  background: {
    type: 'color',
    value: '#2563eb' // CredX blue
  }
};

// Script templates
const VIDEO_SCRIPTS = [
  {
    id: 'credit_karma_myth',
    title: 'Credit Karma Is Lying to You',
    script: `Credit Karma is lying to you. They tell you your score is 720, but when you go to buy a house, the bank says it's 680. What happened? Here's the truth: Credit Karma uses VantageScore 3.0. Mortgage lenders use FICO Score 2. That's 40 years apart in algorithm technology. VantageScore counts rent and utilities. FICO doesn't. That's why there's a 20 to 50 point difference. Don't trust Credit Karma for mortgages! Get my free credit score guide. Link in bio.`,
    duration: 60
  },
  {
    id: 'success_story_520_720',
    title: '520 to 720 in 6 Months',
    script: `Six months ago, my credit score was 520. Today, it's 720. I was denied for an apartment, denied for a car loan. Then I learned about credit repair. I disputed 8 negative items. Got 5 deleted. Added authorized user tradelines. Got a secured card. Month 1: 520 to 580. Month 3: 580 to 650. Month 6: 650 to 720. Now I'm approved for everything. I documented every step in my free 5-day masterclass. Link in bio to get started.`,
    duration: 60
  },
  {
    id: 'dispute_letters',
    title: 'How to Write Dispute Letters',
    script: `I'm going to show you how to write a dispute letter that gets negative items deleted. First: Get your credit report. Address it to the credit bureau, not the creditor. State the facts. This account is inaccurate. I never made this payment late. Be specific. Demand deletion. Under FCRA 611, if they can't verify in 30 days, they must delete. Give them that deadline. Send certified mail. I have the exact template I use. Grab it free. Link in bio.`,
    duration: 60
  }
];

// Generate video with HeyGen
async function generateHeyGenVideo(scriptConfig) {
  try {
    console.log(`🎬 Generating video: ${scriptConfig.title}`);
    
    const response = await axios.post(
      `${HEYGEN_API_URL}/video.generate`,
      {
        avatar_id: AVATAR_CONFIG.avatar_id,
        voice: {
          voice_id: AVATAR_CONFIG.voice_id,
          rate: 1.0,
          pitch: 1.0
        },
        script: scriptConfig.script,
        background: AVATAR_CONFIG.background,
        caption: true
      },
      {
        headers: {
          'Authorization': `Bearer ${HEYGEN_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const videoId = response.data.data.video_id;
    console.log(`✅ Video generated! ID: ${videoId}`);
    
    // Poll for video completion
    const videoUrl = await waitForVideoCompletion(videoId);
    
    // Download video
    const videoPath = await downloadVideo(videoUrl, scriptConfig.id);
    
    return {
      success: true,
      videoId: videoId,
      videoPath: videoPath,
      title: scriptConfig.title
    };
    
  } catch (error) {
    console.error('❌ HeyGen video generation failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Wait for video to be ready
async function waitForVideoCompletion(videoId, maxAttempts = 60) {
  console.log('⏳ Waiting for video to render...');
  
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
    
    try {
      const response = await axios.get(
        `${HEYGEN_API_URL}/video.status?video_id=${videoId}`,
        {
          headers: {
            'Authorization': `Bearer ${HEYGEN_API_KEY}`
          }
        }
      );
      
      const status = response.data.data.status;
      console.log(`   Attempt ${i + 1}: ${status}`);
      
      if (status === 'completed') {
        return response.data.data.video_url;
      }
      
      if (status === 'failed') {
        throw new Error('Video generation failed');
      }
      
    } catch (error) {
      console.error('Error checking video status:', error.message);
    }
  }
  
  throw new Error('Video generation timed out');
}

// Download video file
async function downloadVideo(url, filename) {
  const videosDir = path.join(__dirname, '..', 'videos');
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }
  
  const videoPath = path.join(videosDir, `${filename}.mp4`);
  
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream'
  });
  
  const writer = fs.createWriteStream(videoPath);
  response.data.pipe(writer);
  
  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      console.log(`✅ Video downloaded: ${videoPath}`);
      resolve(videoPath);
    });
    writer.on('error', reject);
  });
}

// Schedule daily video generation
function scheduleVideoGeneration() {
  console.log('📅 Scheduling daily video generation...');
  
  // Generate video every day at 6 AM
  cron.schedule('0 6 * * *', async () => {
    console.log('🎬 Starting daily video generation...');
    
    // Get script for today (rotate through scripts)
    const dayOfWeek = new Date().getDay();
    const script = VIDEO_SCRIPTS[dayOfWeek % VIDEO_SCRIPTS.length];
    
    const result = await generateHeyGenVideo(script);
    
    if (result.success) {
      // Add to posting queue
      await addToPostingQueue(result);
    }
  });
}

// Add video to posting queue
async function addToPostingQueue(videoInfo) {
  const queuePath = path.join(__dirname, '..', 'queue', 'posting-queue.json');
  
  let queue = [];
  if (fs.existsSync(queuePath)) {
    queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  }
  
  queue.push({
    ...videoInfo,
    scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // Post 2 hours later
    platforms: ['youtube', 'tiktok', 'instagram'],
    status: 'pending'
  });
  
  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
  console.log('✅ Video added to posting queue');
}

// Generate all scripts at once (for batch creation)
async function generateAllVideos() {
  console.log('🎬 Generating all video scripts...\n');
  
  for (const script of VIDEO_SCRIPTS) {
    console.log(`\n📹 ${script.title}`);
    console.log('='.repeat(50));
    
    const result = await generateHeyGenVideo(script);
    
    if (result.success) {
      console.log(`✅ Success: ${result.videoPath}`);
    } else {
      console.log(`❌ Failed: ${result.error}`);
    }
    
    // Wait between requests to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

// Manual video generation
async function generateSingleVideo(scriptId) {
  const script = VIDEO_SCRIPTS.find(s => s.id === scriptId);
  
  if (!script) {
    console.error(`Script "${scriptId}" not found`);
    console.log('Available:', VIDEO_SCRIPTS.map(s => s.id).join(', '));
    return;
  }
  
  return await generateHeyGenVideo(script);
}

// Export for use in other modules
module.exports = {
  generateHeyGenVideo,
  generateAllVideos,
  generateSingleVideo,
  scheduleVideoGeneration,
  VIDEO_SCRIPTS
};

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args[0] === 'all') {
    generateAllVideos();
  } else if (args[0]) {
    generateSingleVideo(args[0]);
  } else {
    console.log('Usage:');
    console.log('  node generate-video.js all          # Generate all videos');
    console.log('  node generate-video.js credit_karma_myth  # Generate specific video');
    console.log('');
    console.log('Available scripts:');
    VIDEO_SCRIPTS.forEach(s => console.log(`  - ${s.id}: ${s.title}`));
  }
}
