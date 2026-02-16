# CredX Social Media Automation System

## Overview
This system automates comment monitoring, responses, and content scheduling for CredX social media presence.

## Architecture

### Components
1. **Comment Monitor** - Watches for new comments via APIs/webhooks
2. **Auto-Responder** - Generates contextual replies using AI
3. **Content Scheduler** - Queues and posts content
4. **Analytics Tracker** - Monitors performance metrics

---

## Setup Instructions

### 1. Install Dependencies
```bash
cd /root/.openclaw/workspace/credx/automation
npm install
```

### 2. Configure API Keys
Create `.env` file:

```env
# YouTube API
YOUTUBE_API_KEY=your_api_key_here
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret
YOUTUBE_CHANNEL_ID=UCyour_channel_id

# Instagram Graph API
INSTAGRAM_ACCESS_TOKEN=your_token
INSTAGRAM_ACCOUNT_ID=your_account_id

# OpenAI (for comment responses)
OPENAI_API_KEY=your_openai_key

# HeyGen (for video generation)
HEYGEN_API_KEY=your_heygen_key

# Webhook URL (for real-time notifications)
WEBHOOK_SECRET=your_webhook_secret

# CredX Configuration
CREDX_API_URL=http://localhost:3001
MASTERCLASS_URL=https://credxme.com
```

### 3. Get YouTube API Credentials

1. Go to https://console.cloud.google.com
2. Create new project: "CredX Social"
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials
5. Download client_secret.json
6. Run: `node scripts/youtube-auth.js` to get refresh token

### 4. Get Instagram API Credentials

1. Go to https://developers.facebook.com
2. Create app: "CredX Content"
3. Add Instagram Graph API product
4. Get access token with permissions:
   - instagram_basic
   - instagram_content_publish
   - instagram_manage_comments
5. Connect to your Instagram Business account

### 5. Start the Automation Server

```bash
npm start
```

Server runs on port 3002 by default.

---

## Features

### 1. Auto-Comment Response

**Triggers:**
- New comment posted
- Reply to your comment
- Question about credit repair
- Spam/low-quality comment

**Response Types:**

#### Positive Comment
```
"Thanks [name]! 🙌 Check out my free masterclass if you want to learn more strategies!"
```

#### Question About Service
```
"Great question! I cover this in detail in my free 5-day masterclass. Link in bio!"
```

#### Negative Comment
```
"I understand your frustration. The credit system can be confusing. Happy to help clarify - DM me or check out my free guide!"
```

#### Spam/Competitor
- Auto-delete
- Auto-block if repeated

### 2. Content Scheduling

**Daily Schedule:**
- 8:00 AM EST: YouTube Short
- 12:00 PM EST: Instagram Reel
- 6:00 PM EST: TikTok

**Weekly Content Mix:**
- Monday: Myth Buster
- Tuesday: Success Story
- Wednesday: Tutorial
- Thursday: Quick Win
- Friday: Q&A
- Saturday: Business Credit
- Sunday: Motivation

### 3. Analytics Dashboard

Tracks:
- Views per video
- Engagement rate
- Click-through rate
- Leads generated
- Conversion to sales

---

## API Endpoints

### Comment Webhook
```
POST /webhook/youtube/comment
{
  "videoId": "abc123",
  "commentId": "xyz789",
  "author": "John Doe",
  "text": "Great video! How do I start?",
  "timestamp": "2026-02-16T15:30:00Z"
}
```

### Manual Post
```
POST /api/post
{
  "platform": "youtube",
  "content": {
    "title": "Video Title",
    "description": "Description text",
    "videoUrl": "https://..."
  }
}
```

### Generate Video
```
POST /api/generate-video
{
  "script": "Credit Karma is lying to you...",
  "avatar": "elephant_cartoon",
  "background": "blue_gradient"
}
```

---

## Response Templates

Stored in `config/responses.json`:

```json
{
  "positive": [
    "Thanks! 🙌",
    "Appreciate it! 🎉",
    "Glad it helped! 💪"
  ],
  "questions": {
    "how_to_start": "Check out my free masterclass - link in bio!",
    "pricing": "I have options from free DIY to done-for-you. Let's chat!",
    "guarantee": "Yes! 90-day money-back guarantee on Aggressive Repair."
  },
  "objections": {
    "scam": "I get it - lots of bad actors in credit repair. That's why I offer free education first. Check out my masterclass!",
    "too_expensive": "I have a completely free option - the 5-day masterclass. Start there!",
    "doesnt_work": "Every situation is different. DM me your specific situation and I'll give you honest feedback."
  }
}
```

---

## Comment Response Rules

### Auto-Reply Enabled
✅ Questions ("How do I...?", "What about...?")
✅ Positive feedback ("Great video!", "Thanks!")
✅ Tag requests ("@friend check this out")
✅ Emoji-only responses ("🔥", "💯")

### Requires Manual Review
⚠️ Complaints ("This didn't work for me")
⚠️ Negative comments ("This is a scam")
⚠️ Complex questions requiring personalization
⚠️ Legal/compliance questions

### Auto-Delete
❌ Spam links
❌ Competitor mentions
❌ Profanity/hate speech
❌ Personal attacks

---

## Monitoring Dashboard

Access at: http://localhost:3002/dashboard

Shows:
- Pending comments to review
- Auto-responses sent today
- Videos posted this week
- Engagement metrics
- Lead conversion stats

---

## Troubleshooting

### Comments not being detected
1. Check YouTube API quota (10,000 units/day)
2. Verify webhook URL is publicly accessible
3. Check API key hasn't expired

### Videos not posting
1. Verify access tokens are valid
2. Check video file exists at specified path
3. Review platform-specific error logs

### Auto-responses sound robotic
1. Update response templates with more personality
2. Add more variations
3. Use GPT-4 for dynamic generation

---

## Security Notes

- Store API keys in environment variables only
- Rotate tokens every 90 days
- Use separate API keys for dev/prod
- Monitor for unauthorized access
- Log all automated actions

---

## Cost Estimation

**Monthly Operating Costs:**
- YouTube API: Free (10k quota/day)
- Instagram API: Free
- OpenAI API: ~$20-50 (depends on volume)
- Hosting: $10-20 (DigitalOcean/Linode)
- Domain: $12/year
- **Total: ~$50-80/month**

**Potential Revenue:**
- 100 leads/day = 3,000/month
- 3% conversion = 90 clients
- $500 avg = $45,000/month
- **ROI: 900x**

---

## Next Steps

1. Set up API keys
2. Test webhook endpoints
3. Configure response templates
4. Run in "monitor only" mode for 1 week
5. Enable auto-responses after review
6. Scale to daily posting

---

**Questions? Check logs at:**
- `/var/log/credx-automation.log`
- Console output
- Dashboard at localhost:3002
