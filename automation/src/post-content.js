const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { google } = require('googleapis');
require('dotenv').config();

// Platform APIs
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

// Posting configuration
const POSTING_SCHEDULE = {
  youtube: { hour: 8, minute: 0 },    // 8:00 AM EST
  instagram: { hour: 12, minute: 0 }, // 12:00 PM EST
  tiktok: { hour: 18, minute: 0 }     // 6:00 PM EST
};

// Hashtag sets
const HASHTAGS = {
  youtube: '#creditrepair #creditscore #personalfinance #credittips #moneymanagement',
  instagram: '#creditrepair #financialfreedom #moneymanagement #creditscore #personalfinance',
  tiktok: '#creditkarma #creditscore #personalfinance #moneytok #creditrepair #financialliteracy'
};

// Video metadata generator
function generateMetadata(videoInfo, platform) {
  const titles = {
    youtube: videoInfo.title,
    instagram: videoInfo.title,
    tiktok: videoInfo.title.split('(')[0].trim() // Shorter for TikTok
  };
  
  const descriptions = {
    youtube: `${videoInfo.title}\n\n🚀 Want to fix your credit? Get my FREE 5-Day Credit Masterclass:\nhttps://credxme.com\n\n📚 RESOURCES:\n• Free credit reports: https://annualcreditreport.com\n• Join our community: https://facebook.com/groups/credx\n\n⏱️ TIMESTAMPS:\n0:00 - Hook\n0:15 - The Problem\n0:30 - The Solution\n0:45 - Call to Action\n\n${HASHTAGS.youtube}`,
    
    instagram: `${videoInfo.title}\n\nWant to fix your credit? Link in bio for my FREE masterclass! 🎓\n\n${HASHTAGS.instagram}`,
    
    tiktok: `${videoInfo.title}\n\nFree masterclass in bio! 👆\n\n${HASHTAGS.tiktok}`
  };
  
  return {
    title: titles[platform],
    description: descriptions[platform],
    tags: ['credit repair', 'credit score', 'personal finance', 'money tips', 'financial freedom']
  };
}

// Post to YouTube
async function postToYouTube(videoPath, videoInfo) {
  try {
    console.log('📺 Posting to YouTube...');
    
    const metadata = generateMetadata(videoInfo, 'youtube');
    
    // YouTube requires OAuth2 for uploads
    // This is a simplified version - full implementation needs OAuth flow
    const auth = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      'http://localhost:3002/oauth2callback'
    );
    
    auth.setCredentials({
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
    });
    
    const youtubeAuth = google.youtube({
      version: 'v3',
      auth: auth
    });
    
    const response = await youtubeAuth.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title: metadata.title,
          description: metadata.description,
          tags: metadata.tags,
          categoryId: '27' // Education
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: false
        }
      },
      media: {
        body: fs.createReadStream(videoPath)
      }
    });
    
    console.log(`✅ YouTube: https://youtube.com/shorts/${response.data.id}`);
    return response.data.id;
    
  } catch (error) {
    console.error('❌ YouTube posting failed:', error.message);
    return null;
  }
}

// Post to Instagram
async function postToInstagram(videoPath, videoInfo) {
  try {
    console.log('📸 Posting to Instagram...');
    
    const metadata = generateMetadata(videoInfo, 'instagram');
    
    // Instagram Graph API requires:
    // 1. Upload video to container
    // 2. Wait for processing
    // 3. Publish container
    
    // Step 1: Create media container
    const createResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media`,
      {
        media_type: 'REELS',
        video_url: videoPath, // Must be publicly accessible URL
        caption: metadata.description,
        access_token: process.env.INSTAGRAM_ACCESS_TOKEN
      }
    );
    
    const creationId = createResponse.data.id;
    console.log(`   Container created: ${creationId}`);
    
    // Step 2: Wait for processing
    await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds
    
    // Step 3: Publish
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media_publish`,
      {
        creation_id: creationId,
        access_token: process.env.INSTAGRAM_ACCESS_TOKEN
      }
    );
    
    console.log(`✅ Instagram: Post published`);
    return publishResponse.data.id;
    
  } catch (error) {
    console.error('❌ Instagram posting failed:', error.message);
    return null;
  }
}

// Post to TikTok
async function postToTikTok(videoPath, videoInfo) {
  try {
    console.log('🎵 Posting to TikTok...');
    
    // TikTok API is more restricted and requires:
    // 1. TikTok for Business account
    // 2. Apply for Content Posting API access
    // 3. OAuth flow similar to YouTube
    
    console.log('⚠️  TikTok posting requires Business API access');
    console.log('   Apply at: https://developers.tiktok.com');
    console.log('   For now, manually upload the video from:', videoPath);
    
    return 'manual_upload_required';
    
  } catch (error) {
    console.error('❌ TikTok posting failed:', error.message);
    return null;
  }
}

// Main posting function
async function postContent(videoPath, videoInfo, platforms = ['youtube', 'instagram', 'tiktok']) {
  console.log(`\n🚀 Posting: ${videoInfo.title}`);
  console.log('='.repeat(60));
  
  const results = {};
  
  for (const platform of platforms) {
    switch (platform) {
      case 'youtube':
        results.youtube = await postToYouTube(videoPath, videoInfo);
        break;
      case 'instagram':
        results.instagram = await postToInstagram(videoPath, videoInfo);
        break;
      case 'tiktok':
        results.tiktok = await postToTikTok(videoPath, videoInfo);
        break;
    }
  }
  
  // Log results
  await logPostResults(videoInfo, results);
  
  console.log('\n✅ Posting complete!');
  return results;
}

// Schedule posting from queue
async function processPostingQueue() {
  const queuePath = path.join(__dirname, '..', 'queue', 'posting-queue.json');
  
  if (!fs.existsSync(queuePath)) {
    console.log('📭 No videos in posting queue');
    return;
  }
  
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const now = new Date();
  
  const videosToPost = queue.filter(item => {
    return item.status === 'pending' && new Date(item.scheduledFor) <= now;
  });
  
  for (const video of videosToPost) {
    if (fs.existsSync(video.videoPath)) {
      await postContent(video.videoPath, {
        title: video.title,
        id: video.videoId
      }, video.platforms);
      
      // Update status
      video.status = 'posted';
      video.postedAt = new Date().toISOString();
    } else {
      console.error(`❌ Video file not found: ${video.videoPath}`);
      video.status = 'failed';
    }
  }
  
  // Save updated queue
  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
}

// Log posting results
async function logPostResults(videoInfo, results) {
  const logPath = path.join(__dirname, '..', 'logs', 'posting-log.json');
  
  let logs = [];
  if (fs.existsSync(logPath)) {
    logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
  }
  
  logs.push({
    timestamp: new Date().toISOString(),
    video: videoInfo,
    results: results
  });
  
  fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
}

// Schedule posting jobs
cron.schedule('0 * * * *', () => {
  console.log('⏰ Checking posting queue...');
  processPostingQueue();
});

// Manual post function
async function manualPost(videoPath, title, platforms) {
  return await postContent(videoPath, { title }, platforms);
}

module.exports = {
  postContent,
  manualPost,
  processPostingQueue,
  generateMetadata
};

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args[0] === 'queue') {
    processPostingQueue();
  } else if (args[0] === 'manual' && args[1]) {
    manualPost(args[1], args[2] || 'Manual Post', ['youtube', 'instagram']);
  } else {
    console.log('Usage:');
    console.log('  node post-content.js queue           # Process posting queue');
    console.log('  node post-content.js manual [path] [title]  # Manual post');
  }
}
