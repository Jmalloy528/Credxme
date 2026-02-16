const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🎬 CredX YouTube Authentication Helper\n');
console.log('This script will help you get your YouTube API credentials.\n');

rl.question('Enter your YouTube Client ID: ', (clientId) => {
  if (!clientId) clientId = 'O6Edrkx09WP-47V-LKJh7w';
  
  rl.question('Enter your YouTube Client Secret: ', (clientSecret) => {
    if (!clientSecret) {
      console.log('\n❌ Client Secret is required!');
      console.log('Get it from: https://console.cloud.google.com/apis/credentials');
      rl.close();
      return;
    }
    
    const REDIRECT_URI = 'http://localhost:8080/oauth2callback';
    
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
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
    console.log('Step 1: Open this URL in your browser:');
    console.log('========================================\n');
    console.log(authUrl);
    console.log('\n========================================');
    console.log('Step 2: Log in and click "Allow"');
    console.log('Step 3: You will be redirected to localhost (may show error)');
    console.log('Step 4: Copy the entire URL from your browser');
    console.log('========================================\n');
    
    rl.question('Paste the full redirect URL here: ', async (redirectUrl) => {
      try {
        const parsedUrl = new URL(redirectUrl);
        const code = parsedUrl.searchParams.get('code');
        
        if (!code) {
          console.log('\n❌ Could not find authorization code in URL');
          console.log('Make sure you copied the entire URL after redirect');
          rl.close();
          return;
        }
        
        console.log('\n✅ Code received! Exchanging for tokens...\n');
        
        const { tokens } = await oauth2Client.getToken(code);
        
        console.log('========================================');
        console.log('✅ SUCCESS! Your YouTube Credentials:');
        console.log('========================================\n');
        
        console.log('YOUTUBE_CLIENT_ID=' + clientId);
        console.log('YOUTUBE_CLIENT_SECRET=' + clientSecret);
        console.log('YOUTUBE_REFRESH_TOKEN=' + tokens.refresh_token);
        console.log('');
        
        // Save to file
        const envContent = `# YouTube API Credentials - Generated on ${new Date().toISOString()}
YOUTUBE_API_KEY=REPLACE_WITH_API_KEY_FROM_GOOGLE_CONSOLE
YOUTUBE_CLIENT_ID=${clientId}
YOUTUBE_CLIENT_SECRET=${clientSecret}
YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}
YOUTUBE_CHANNEL_ID=REPLACE_WITH_YOUR_CHANNEL_ID
`;
        
        fs.writeFileSync('youtube-credentials.env', envContent);
        console.log('✅ Credentials saved to: youtube-credentials.env\n');
        
        console.log('Next steps:');
        console.log('1. Add YOUTUBE_API_KEY (get from Google Console)');
        console.log('2. Add YOUTUBE_CHANNEL_ID (get from youtube.com/account_advanced)');
        console.log('3. Copy these to /root/.openclaw/workspace/credx/automation/.env');
        console.log('4. Run: node index.js');
        
      } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.log('\nTroubleshooting:');
        console.log('- Make sure you copied the full URL');
        console.log('- Check that the authorization code hasn\'t expired');
        console.log('- Try the process again');
      }
      
      rl.close();
    });
  });
});
