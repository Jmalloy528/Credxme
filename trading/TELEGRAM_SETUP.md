# Telegram Bot Setup for CredX Trading System

## Overview
Control your trading scanner remotely via Telegram. Get alerts, run scans, and monitor signals from anywhere.

## Features

### Commands
- `/scan` - Run full market analysis
- `/signals` - Get latest spike signals
- `/status` - Check system status
- `/watchlist` - View tracked symbols
- `/positions` - Check open positions (requires broker API)
- `/report` - Daily trading report
- `/alert SYMBOL PRICE` - Set price alerts
- `/help` - Show all commands

### Automatic Alerts
- Spike signal detection
- High-conviction setup alerts
- System status updates
- Daily report at market close

## Setup Instructions

### Step 1: Create Telegram Bot

1. Open Telegram and message **@BotFather**
2. Type `/newbot`
3. Name your bot (e.g., "CredX Trading Bot")
4. Choose username (e.g., "credx_trading_bot")
5. **Save the API token** BotFather gives you

### Step 2: Get Your User ID

1. Message **@userinfobot** on Telegram
2. It will reply with your user ID
3. **Save this number**

### Step 3: Configure Bot

**Option A: Environment Variables (Recommended)**
```bash
export TELEGRAM_BOT_TOKEN="your_bot_token_here"
export ALLOWED_USER_IDS="your_user_id_here"
```

**Option B: Edit File**
Edit `telegram_bot.py` and set:
```python
BOT_TOKEN = "your_bot_token_here"
ALLOWED_USERS = ["your_user_id_here"]
```

### Step 4: Install Dependencies

```bash
cd /root/.openclaw/workspace/credx/trading

# Install python-telegram-bot
pip3 install python-telegram-bot

# Or use requirements.txt
pip3 install -r requirements.txt
```

### Step 5: Run Bot

```bash
# Start bot
python3 telegram_bot.py

# Run in background
tmux new -d -s trading_bot 'python3 telegram_bot.py'

# Or use nohup
nohup python3 telegram_bot.py > bot.log 2>&1 &
```

## Usage Examples

### Check Market Status
```
User: /status
Bot: 📊 Last Scan: 2026-02-17 10:30:00
     🚨 Spike Signals: 3
     🎯 High-Conviction: 1
     ✅ System: Operational
```

### Run Scan
```
User: /scan
Bot: 🔍 Running full market scan...
     
     🚨 TOP TRADING SIGNALS
     
     📊 DG - Score: 7/9
     💰 Price: $89.50
     ✅ Setup: Ichimoku Setup, Near POC
```

### Get Signals
```
User: /signals
Bot: 🚨 ACTIVE SPIKE SIGNALS
     
     📈 DG - BULLISH_SPIKE
     📊 ATR: 1.52x
     🎯 Target: $94.20
     🛑 Stop: $87.15
```

### Set Alert
```
User: /alert NVDA 140
Bot: ✅ Alert set for NVDA at $140.00
     You'll be notified when price hits this level.
```

## Advanced: Auto-Alerts

Create a cron job to auto-send alerts:

```bash
# Edit crontab
crontab -e

# Run scan every 30 minutes during market hours (9:30 AM - 4:00 PM EST)
*/30 9-16 * * 1-5 cd /root/.openclaw/workspace/credx/trading && python3 run_analysis.py

# Send daily report at market close (4:30 PM EST)
30 16 * * 1-5 cd /root/.openclaw/workspace/credx/trading && python3 telegram_report.py
```

## Security

- **Never share your bot token**
- **Restrict to your User ID only** (ALLOWED_USER_IDS)
- Use read-only API keys for broker connections
- Run bot on secure server/VPN

## Troubleshooting

### Bot not responding
1. Check bot token is correct
2. Ensure bot is running: `ps aux | grep telegram_bot`
3. Check logs: `tail -f bot.log`

### Commands not working
1. Verify user ID is in ALLOWED_USERS
2. Check file permissions
3. Ensure scanner dependencies are installed

### No signals showing
1. Run `/scan` first to generate data
2. Check market is open (no signals on weekends)
3. Verify symbols in watchlist

## Webhook Mode (Production)

For 24/7 operation with webhook:

```python
# In telegram_bot.py, replace polling with webhook
application.run_webhook(
    listen='0.0.0.0',
    port=8443,
    webhook_url='https://your-server.com/webhook'
)
```

Requires:
- SSL certificate
- Domain name
- Port forwarding

## Files

- `telegram_bot.py` - Main bot code
- `telegram_report.py` - Scheduled report sender (optional)
- `bot_config.json` - User settings and alerts (auto-created)

## Next Steps

1. [ ] Create bot with @BotFather
2. [ ] Get user ID from @userinfobot
3. [ ] Configure token and user ID
4. [ ] Install dependencies
5. [ ] Test commands
6. [ ] Set up auto-alerts
7. [ ] Add broker API for position tracking

---

**Questions?** Check README.md for trading system overview.
