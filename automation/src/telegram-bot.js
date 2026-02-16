const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

// Your Telegram Bot Token
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8554114498:AAEhTxYU5AYuAb93jyMTZSbQgArgSiF0eJk';

// Initialize bot
const bot = new TelegramBot(TOKEN, { polling: true });

// Your chat ID (we'll get this when you first message the bot)
let ADMIN_CHAT_ID = null;

console.log('🤖 CredX Telegram Bot Started!');
console.log('Send /start to your bot to activate\n');

// Welcome message
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name;
  
  ADMIN_CHAT_ID = chatId;
  
  const welcomeMessage = `
🎉 Welcome to CredX, ${name}!

I'm Jimmy, your AI assistant. I can help you:

📊 Check Stats
• "How many leads today?"
• "Website status"
• "Show analytics"

📱 Manage Social Media  
• "Post video today"
• "Check comments"
• "Reply to [username]"

💼 Business Tasks
• "Add affiliate link"
• "Update pricing"
• "Check backend status"

🎬 Content Creation
• "Generate video script"
• "Create thumbnail text"
• "Write email sequence"

Just type what you need!
  `;
  
  bot.sendMessage(chatId, welcomeMessage);
  console.log(`✅ Bot activated by ${name} (Chat ID: ${chatId})`);
});

// Handle all messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const name = msg.from.first_name;
  
  // Store admin chat ID
  if (!ADMIN_CHAT_ID) {
    ADMIN_CHAT_ID = chatId;
  }
  
  // Skip command messages
  if (text.startsWith('/')) return;
  
  console.log(`📩 Message from ${name}: ${text}`);
  
  // Simple command routing
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('lead') || lowerText.includes('signup')) {
    // Check leads from backend
    try {
      const response = await axios.get('http://localhost:3001/api/leads');
      const leads = response.data.data || [];
      const today = leads.filter(l => {
        const leadDate = new Date(l.createdAt);
        const now = new Date();
        return leadDate.toDateString() === now.toDateString();
      });
      
      bot.sendMessage(chatId, `📊 Today's Stats:\n\n✅ New Leads Today: ${today.length}\n📈 Total Leads: ${leads.length}`);
    } catch (error) {
      bot.sendMessage(chatId, '❌ Cannot connect to backend. Is it running?');
    }
  }
  
  else if (lowerText.includes('website') || lowerText.includes('status')) {
    bot.sendMessage(chatId, `
🌐 Website Status:

✅ Frontend: https://credx-website.vercel.app
⏳ Domain: credxme.com (waiting for DNS)
⚙️ Backend: localhost:3001

To fix domain: Update DNS A record to 76.76.21.21
    `);
  }
  
  else if (lowerText.includes('video') || lowerText.includes('script')) {
    bot.sendMessage(chatId, `
🎬 Quick Video Script:

"Credit Karma is lying to you. They say 720, bank says 680. Here's why: VantageScore vs FICO. 20-50 point difference. Don't trust it for mortgages! Get my free guide - link in bio."

Record this in HeyGen and post to YouTube!
    `);
  }
  
  else if (lowerText.includes('help') || lowerText.includes('?')) {
    bot.sendMessage(chatId, `
🤖 Available Commands:

📊 "leads" - Check today's leads
🌐 "website" - Website status  
🎬 "video" - Get video script
💬 "comments" - Check YouTube comments
📧 "email" - Check email sequence
⚙️ "backend" - Backend status

Or just ask me anything!
    `);
  }
  
  else {
    // Forward to main AI for complex queries
    bot.sendMessage(chatId, `🤖 Processing: "${text}"\n\nI'll help with this. Check the main chat for detailed response.`);
    
    // Log for main system
    console.log(`[TELEGRAM] ${name}: ${text}`);
    console.log(`[TELEGRAM] Chat ID: ${chatId} (save this for notifications)`);
  }
});

// Function to send notifications TO your phone
function sendNotification(message) {
  if (ADMIN_CHAT_ID) {
    bot.sendMessage(ADMIN_CHAT_ID, `🔔 ${message}`);
  } else {
    console.log('⚠️  No admin chat ID set. Message /start to the bot first.');
  }
}

// Example: Send notification on new lead
function notifyNewLead(leadData) {
  sendNotification(`
🎉 New Lead!

👤 ${leadData.firstName} ${leadData.lastName}
📧 ${leadData.email}
🎯 Goal: ${leadData.creditGoal || 'Not specified'}

Check dashboard for details.
  `);
}

// Export for use in other modules
module.exports = {
  bot,
  sendNotification,
  notifyNewLead
};

// If run directly
if (require.main === module) {
  console.log('Bot is running... Press Ctrl+C to stop.');
}
