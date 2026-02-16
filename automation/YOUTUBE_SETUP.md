# YouTube API Setup Guide for CredX

## Step-by-Step Instructions

### Step 1: Enable YouTube Data API

1. Go to: https://console.cloud.google.com/apis/library/youtube.googleapis.com
2. Select your project (or create new one called "CredX Social")
3. Click **"ENABLE"**
4. Wait for it to activate (takes 1-2 minutes)

### Step 2: Get API Key

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click **"+ CREATE CREDENTIALS"** (top button)
3. Select **"API key"**
4. Copy the key (starts with `AIza...`)
5. Click **"RESTRICT KEY"**
6. Under "API restrictions" select **"YouTube Data API v3"**
7. Click **"SAVE"**

### Step 3: Get OAuth 2.0 Credentials

1. Still at: https://console.cloud.google.com/apis/credentials
2. Click **"+ CREATE CREDENTIALS"**
3. Select **"OAuth client ID"**
4. If asked to configure consent screen:
   - Click "CONFIGURE CONSENT SCREEN"
   - Select "External"
   - App name: "CredX Social Media"
   - User support email: contact@credxme.com
   - Developer contact: contact@credxme.com
   - Save
5. Application type: **"Web application"**
6. Name: "CredX YouTube Automation"
7. Authorized redirect URIs:
   - Add: `http://localhost:3002/oauth2callback`
   - Add: `http://localhost:8080/oauth2callback`
8. Click **"CREATE"**
9. Copy the **Client ID** and **Client Secret**

### Step 4: Get Your Channel ID

1. Go to: https://www.youtube.com/account_advanced
2. Look for "YouTube Channel ID"
3. Copy it (starts with `UC...`)

### Step 5: Get Refresh Token (Run This Script)

Save this file and run it:

```javascript
const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const fs = require('fs');

const CLIENT_ID = 'O6Edrkx09WP-47V-LKJh7w';  // Your client ID
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET_HERE';  // From step 3
const REDIRECT_URI = 'http://localhost:8080/oauth2callback';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube.force-ssl'
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent'
});

console.log('\n========================================');
console.log('1. Open this URL in your browser:');
console.log(authUrl);
console.log('\n2. Log in with your YouTube account');
console.log('3. Click "Allow"');
console.log('4. You will be redirected to localhost (it will show an error, that\'s OK)');
console.log('5. Copy the CODE from the URL');
console.log('\nWaiting for authorization...\n');

const server = http.createServer(async (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  
  if (queryObject.code) {
    console.log('\n✅ Authorization code received!');
    
    try {
      const { tokens } = await oauth2Client.getToken(queryObject.code);
      
      console.log('\n========================================');
      console.log('YOUR CREDENTIALS:');
      console.log('========================================');
      console.log('Client ID:', CLIENT_ID);
      console.log('Client Secret:', CLIENT_SECRET);
      console.log('Refresh Token:', tokens.refresh_token);
      console.log('Access Token:', tokens.access_token);
      console.log('\nAdd these to your .env file!');
      console.log('========================================\n');
      
      // Save to file
      const envContent = `
YOUTUBE_CLIENT_ID=${CLIENT_ID}
YOUTUBE_CLIENT_SECRET=${CLIENT_SECRET}
YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}
`;
      fs.writeFileSync('youtube-credentials.txt', envContent);
      console.log('✅ Credentials saved to youtube-credentials.txt');
      
      res.end('<h1>Success! Check your terminal.</h1>');
      server.close();
      process.exit(0);
      
    } catch (error) {
      console.error('Error:', error);
      res.end('<h1>Error. Check terminal.</h1>');
    }
  }
});

server.listen(8080, () => {
  console.log('Server listening on port 8080...');
});
```

## Credentials You Need

After completing all steps, you'll have:

```
YOUTUBE_API_KEY=AIza...              (from Step 2)
YOUTUBE_CLIENT_ID=O6Edrkx09WP-47V-LKJh7w    (you already have this)
YOUTUBE_CLIENT_SECRET=...            (from Step 3)
YOUTUBE_REFRESH_TOKEN=1//...         (from Step 5 script)
YOUTUBE_CHANNEL_ID=UC...             (from Step 4)
```

## Troubleshooting

### "API not enabled" error
- Go back to Step 1 and make sure YouTube Data API v3 is enabled
- Wait 2-3 minutes after enabling

### "Redirect URI mismatch" error
- Make sure you added `http://localhost:8080/oauth2callback` to authorized URIs
- Check for typos (http vs https)

### Can't find API key section
- Make sure you're at: https://console.cloud.google.com/apis/credentials
- Click the project dropdown (top left) to select "CredX Social"

### Consent screen not configured
- You MUST configure OAuth consent screen before creating OAuth credentials
- Use "External" for testing
- Add your email as test user

## Next Steps

Once you have all credentials:

1. Copy them to: `/root/.openclaw/workspace/credx/automation/.env`
2. Run: `cd /root/.openclaw/workspace/credx/automation && npm install`
3. Start automation: `node index.js`
4. Access dashboard: http://localhost:3002

## Need Help?

If you get stuck, I can:
- Walk you through each step
- Debug specific errors
- Provide alternative approaches

Just share what step you're on and what error you see.
