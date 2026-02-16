const { google } = require('googleapis');
const OpenAI = require('openai');
require('dotenv').config();

// Initialize APIs
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Response templates
const RESPONSE_TEMPLATES = {
  positive: [
    "Thanks! 🙌 Check out my free masterclass for more tips!",
    "Appreciate it! 🎉 Link in bio for the free course!",
    "Glad it helped! 💪 Grab my free dispute templates!",
    "Thanks for watching! 🙏 Free masterclass link in bio!"
  ],
  
  questions: {
    how_to_start: [
      "Great question! I cover this in my free 5-day masterclass. Link in bio! 🎓",
      "Check out my free masterclass - starts with the basics! Link below 👇",
      "I have a free course that walks you through everything! Link in bio 📚"
    ],
    
    pricing: [
      "I have options from free DIY to done-for-you! Let's chat - DM me 💬",
      "Start with my free masterclass! Then we can discuss if you want help 🙌",
      "Free 5-day course first, then decide if you want the paid service! 👇"
    ],
    
    does_it_work: [
      "Every situation is different! DM me your specifics and I'll give honest feedback 📩",
      "Check out my success stories! But results vary - that's why I start with free education 🎓",
      "It works when done right! Start with my free masterclass to learn how 💪"
    ]
  },
  
    general: [
      "Thanks for commenting! 🙌 Check out my free masterclass link in bio!",
      "Appreciate you! 🎉 Free 5-day course link below 👇",
      "Thanks! DM me if you have questions 💬"
    ]
  }
};

// Keywords to categorize comments
const KEYWORDS = {
  question: ['how', 'what', 'when', 'where', 'why', '?', 'help', 'question'],
  pricing: ['cost', 'price', 'how much', 'fee', 'expensive', 'cheap', 'afford'],
  start: ['start', 'begin', 'first step', 'get started', 'sign up'],
  works: ['work', 'scam', 'legit', 'real', 'fake', 'actually'],
  positive: ['great', 'awesome', 'amazing', 'thanks', 'helpful', 'love', '🔥', '💯'],
  negative: ['scam', 'fake', 'rip off', 'waste', 'doesn\'t work', 'terrible'],
  spam: ['click here', 'check my', 'free money', 'earn now', 'www.', 'http']
};

// Categorize comment
function categorizeComment(text) {
  const lowerText = text.toLowerCase();
  
  if (KEYWORDS.spam.some(k => lowerText.includes(k))) return 'spam';
  if (KEYWORDS.negative.some(k => lowerText.includes(k))) return 'negative';
  if (KEYWORDS.question.some(k => lowerText.includes(k))) return 'question';
  if (KEYWORDS.pricing.some(k => lowerText.includes(k))) return 'pricing';
  if (KEYWORDS.start.some(k => lowerText.includes(k))) return 'start';
  if (KEYWORDS.works.some(k => lowerText.includes(k))) return 'works';
  if (KEYWORDS.positive.some(k => lowerText.includes(k))) return 'positive';
  
  return 'general';
}

// Generate AI response for complex comments
async function generateAIResponse(comment, category, context = {}) {
  const prompt = `You are James Malloy, founder of CredX, a credit repair education company. 
Respond to this ${category} comment in a friendly, helpful way. Keep it under 100 characters.

Comment: "${comment}"

Context: Free masterclass available, 90-day guarantee on services.

Response:`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 60,
      temperature: 0.7
    });
    
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI generation failed:', error);
    return getTemplateResponse(category);
  }
}

// Get template response
function getTemplateResponse(category) {
  const templates = RESPONSE_TEMPLATES[category] || RESPONSE_TEMPLATES.general;
  
  if (Array.isArray(templates)) {
    return templates[Math.floor(Math.random() * templates.length)];
  }
  
  // For nested objects (questions)
  const subCategory = Object.keys(templates)[0];
  const subTemplates = templates[subCategory];
  return subTemplates[Math.floor(Math.random() * subTemplates.length)];
}

// Main response function
async function generateResponse(commentText, commenterName, videoContext = {}) {
  const category = categorizeComment(commentText);
  
  console.log(`Comment from ${commenterName}: "${commentText}"`);
  console.log(`Category: ${category}`);
  
  // Don't respond to spam
  if (category === 'spam') {
    return { shouldRespond: false, action: 'delete', reason: 'spam' };
  }
  
  // Flag negative for manual review
  if (category === 'negative') {
    return { 
      shouldRespond: false, 
      action: 'manual_review', 
      reason: 'negative_sentiment',
      suggestedResponse: "I understand your concerns. DM me and let's talk about your specific situation."
    };
  }
  
  // Generate response
  let response;
  
  if (category === 'question' || category === 'pricing') {
    // Use AI for complex responses
    response = await generateAIResponse(commentText, category, videoContext);
  } else {
    // Use templates for simple responses
    response = getTemplateResponse(category);
  }
  
  // Personalize with name if available
  if (commenterName && !commenterName.includes(' ')) {
    response = response.replace('Thanks', `Thanks ${commenterName}`);
  }
  
  return {
    shouldRespond: true,
    action: 'reply',
    response: response,
    category: category
  };
}

// Monitor YouTube comments
async function monitorYouTubeComments() {
  try {
    // Get recent videos
    const videosResponse = await youtube.search.list({
      channelId: process.env.YOUTUBE_CHANNEL_ID,
      part: 'snippet',
      order: 'date',
      maxResults: 10
    });
    
    for (const video of videosResponse.data.items) {
      const videoId = video.id.videoId;
      
      // Get comments for this video
      const commentsResponse = await youtube.commentThreads.list({
        part: 'snippet',
        videoId: videoId,
        maxResults: 100,
        order: 'time'
      });
      
      if (!commentsResponse.data.items) continue;
      
      for (const thread of commentsResponse.data.items) {
        const comment = thread.snippet.topLevelComment.snippet;
        const commentId = thread.id;
        
        // Check if already responded (you'd track this in database)
        const alreadyResponded = await checkIfResponded(commentId);
        if (alreadyResponded) continue;
        
        // Generate response
        const result = await generateResponse(
          comment.textDisplay,
          comment.authorDisplayName,
          { videoTitle: video.snippet.title }
        );
        
        if (result.shouldRespond) {
          // Post reply
          await postYouTubeReply(commentId, result.response);
          console.log(`✅ Replied to ${comment.authorDisplayName}: "${result.response}"`);
          
          // Log to database
          await logResponse(commentId, result);
        } else {
          console.log(`⏭️  Skipped comment: ${result.reason}`);
        }
      }
    }
  } catch (error) {
    console.error('Error monitoring YouTube:', error);
  }
}

// Post reply to YouTube
async function postYouTubeReply(parentId, text) {
  try {
    await youtube.comments.insert({
      part: 'snippet',
      requestBody: {
        snippet: {
          parentId: parentId,
          textOriginal: text
        }
      }
    });
  } catch (error) {
    console.error('Error posting reply:', error);
  }
}

// Database functions (implement with your DB)
async function checkIfResponded(commentId) {
  // Check if we've already responded to this comment
  // Return true/false
  return false; // Placeholder
}

async function logResponse(commentId, responseData) {
  // Log the response to database
  console.log('Logging response:', { commentId, ...responseData });
}

// Run every 5 minutes
setInterval(monitorYouTubeComments, 5 * 60 * 1000);

// Run immediately on start
monitorYouTubeComments();

module.exports = {
  generateResponse,
  categorizeComment,
  monitorYouTubeComments
};
