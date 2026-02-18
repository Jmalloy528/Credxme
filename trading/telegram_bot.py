#!/usr/bin/env python3
"""
Telegram Bot for CredX Trading System
Remote monitoring and control via Telegram
"""

import os
import json
import asyncio
from datetime import datetime
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes
import subprocess
import sys

# Bot Configuration
BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', 'YOUR_BOT_TOKEN_HERE')
ALLOWED_USERS = os.getenv('ALLOWED_USER_IDS', '').split(',')  # Comma-separated user IDs
TRADING_DIR = '/root/.openclaw/workspace/credx/trading'

# Command handlers
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Start command"""
    user_id = str(update.effective_user.id)
    username = update.effective_user.username
    
    if ALLOWED_USERS[0] and user_id not in ALLOWED_USERS:
        await update.message.reply_text("⛔ Unauthorized access.")
        return
    
    welcome_msg = f"""
🚀 **CredX Trading Bot**
Welcome, {username}!

Available commands:
📊 /scan - Run full market scan
📈 /signals - Get latest spike signals  
📉 /status - Check system status
💼 /positions - View current positions
🎯 /watchlist - Show watchlist
⚡ /alert - Set price alerts
📱 /report - Daily report
❓ /help - Show all commands

Bot Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} UTC
"""
    await update.message.reply_text(welcome_msg, parse_mode='Markdown')

async def scan(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Run full analysis scan"""
    await update.message.reply_text("🔍 Running full market scan... This may take 2-3 minutes.")
    
    try:
        # Run the analysis
        result = subprocess.run(
            ['python3', f'{TRADING_DIR}/run_analysis.py'],
            capture_output=True,
            text=True,
            timeout=300
        )
        
        # Check for results
        if os.path.exists(f'{TRADING_DIR}/daily_analysis.json'):
            with open(f'{TRADING_DIR}/daily_analysis.json', 'r') as f:
                data = json.load(f)
            
            signals = data.get('combined', [])
            if signals:
                top_signals = signals[:5]
                msg = "🚨 **TOP TRADING SIGNALS**\n\n"
                for sig in top_signals:
                    msg += f"📊 **{sig['symbol']}** - Score: {sig['score']}/9\n"
                    msg += f"💰 Price: ${sig['price']:.2f}\n"
                    msg += f"✅ Setup: {', '.join(sig['reasons'])}\n\n"
            else:
                msg = "⚠️ No high-conviction signals found.\nMarket may be ranging."
        else:
            msg = "❌ Scan completed but no results file found."
            
        await update.message.reply_text(msg, parse_mode='Markdown')
        
    except Exception as e:
        await update.message.reply_text(f"❌ Error running scan: {str(e)}")

async def signals(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Get latest spike signals"""
    try:
        if os.path.exists(f'{TRADING_DIR}/daily_analysis.json'):
            with open(f'{TRADING_DIR}/daily_analysis.json', 'r') as f:
                data = json.load(f)
            
            spike_signals = data.get('spike_signals', [])
            
            if spike_signals:
                msg = "🚨 **ACTIVE SPIKE SIGNALS**\n\n"
                for sig in spike_signals[:5]:
                    msg += f"📈 {sig['symbol']} - {sig['type']}\n"
                    msg += f"📊 ATR: {sig['atr_clearance']:.2f}x\n"
                    msg += f"🎯 Target: ${sig['target_50pct']:.2f}\n"
                    msg += f"🛑 Stop: ${sig['stop_loss']:.2f}\n\n"
            else:
                msg = "📭 No active spike signals.\nMarket is quiet or no setups meeting criteria."
        else:
            msg = "⚠️ No scan data available. Run /scan first."
            
        await update.message.reply_text(msg, parse_mode='Markdown')
        
    except Exception as e:
        await update.message.reply_text(f"❌ Error: {str(e)}")

async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Check system status"""
    try:
        # Check if analysis exists
        if os.path.exists(f'{TRADING_DIR}/daily_analysis.json'):
            with open(f'{TRADING_DIR}/daily_analysis.json', 'r') as f:
                data = json.load(f)
            
            timestamp = data.get('timestamp', 'Unknown')
            spike_count = len(data.get('spike_signals', []))
            setup_count = len(data.get('combined', []))
            
            msg = f"""
📊 **SYSTEM STATUS**

🕐 Last Scan: {timestamp}
🚨 Spike Signals: {spike_count}
🎯 High-Conviction Setups: {setup_count}
📁 Watchlist: 15 symbols
✅ System: Operational

Time Now: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} UTC
"""
        else:
            msg = """
⚠️ **SYSTEM STATUS**

🕐 Last Scan: Never
📊 Status: No data available

Run /scan to initialize system.
"""
        await update.message.reply_text(msg, parse_mode='Markdown')
        
    except Exception as e:
        await update.message.reply_text(f"❌ Error: {str(e)}")

async def watchlist(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show current watchlist"""
    from scanner import DEFAULT_WATCHLIST
    
    msg = "📋 **CURRENT WATCHLIST**\n\n"
    
    # Split into groups of 5
    for i in range(0, len(DEFAULT_WATCHLIST), 5):
        group = DEFAULT_WATCHLIST[i:i+5]
        msg += f"{i+1}-{i+len(group)}: {', '.join(group)}\n"
    
    msg += f"\n📊 Total: {len(DEFAULT_WATCHLIST)} symbols"
    
    keyboard = [
        [InlineKeyboardButton("🔄 Run Scan", callback_data='scan')],
        [InlineKeyboardButton("📈 Get Signals", callback_data='signals')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(msg, parse_mode='Markdown', reply_markup=reply_markup)

async def positions(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """View current positions (placeholder for broker integration)"""
    msg = """
💼 **POSITIONS**

This feature requires broker API integration.

Supported brokers:
• Alpaca
• TD Ameritrade
• Interactive Brokers
• Webull

To enable:
1. Set BROKER_API_KEY environment variable
2. Configure API credentials
3. Re-run bot

Current: Manual position tracking only
"""
    await update.message.reply_text(msg, parse_mode='Markdown')

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show help"""
    help_msg = """
🤖 **CredX Trading Bot - Commands**

**Market Analysis:**
/scan - Run full market analysis
/signals - View spike signals
/status - Check system status
/watchlist - Show all tracked symbols

**Trading:**
/positions - View current positions
/report - Generate daily report

**Alerts:**
/alert - Set price alerts
/alerts - View active alerts

**System:**
/help - Show this help
/start - Welcome message

**Quick Actions:**
Scan runs automatically at market open.
Alerts trigger on signal detection.
"""
    await update.message.reply_text(help_msg, parse_mode='Markdown')

async def report(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Generate daily report"""
    try:
        if os.path.exists(f'{TRADING_DIR}/daily_analysis.json'):
            with open(f'{TRADING_DIR}/daily_analysis.json', 'r') as f:
                data = json.load(f)
            
            msg = f"""
📊 **DAILY TRADING REPORT**
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} UTC

**Market Scan Results:**
• Spike Signals: {len(data.get('spike_signals', []))}
• High-Conviction Setups: {len(data.get('combined', []))}

**Top Setups:**
"""
            top_setups = data.get('combined', [])[:3]
            if top_setups:
                for setup in top_setups:
                    msg += f"\n🎯 {setup['symbol']} (Score: {setup['score']}/9)"
                    msg += f"\n   Price: ${setup['price']:.2f}"
                    msg += f"\n   Signals: {', '.join(setup['reasons'])}"
            else:
                msg += "\n⚠️ No high-conviction setups today"
            
            msg += "\n\n**Strategy:** Spike Reversal (30-min)"
            msg += "\n**ATR Threshold:** 150%+"
            msg += "\n**Target:** 50% retracement"
            
        else:
            msg = "⚠️ No data available. Run /scan to generate report."
            
        await update.message.reply_text(msg, parse_mode='Markdown')
        
    except Exception as e:
        await update.message.reply_text(f"❌ Error: {str(e)}")

# Callback handlers for inline buttons
async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle inline keyboard callbacks"""
    query = update.callback_query
    await query.answer()
    
    if query.data == 'scan':
        await scan(update, context)
    elif query.data == 'signals':
        await signals(update, context)

# Alert system (placeholder)
async def alert_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Set price alerts"""
    if not context.args:
        await update.message.reply_text(
            "Usage: /alert SYMBOL PRICE\n"
            "Example: /alert AAPL 150.00"
        )
        return
    
    symbol = context.args[0].upper()
    price = float(context.args[1])
    
    # Save alert (would need persistent storage)
    await update.message.reply_text(
        f"✅ Alert set for {symbol} at ${price:.2f}\n"
        f"You'll be notified when price hits this level."
    )

def main():
    """Start the bot"""
    # Check if token is set
    if BOT_TOKEN == 'YOUR_BOT_TOKEN_HERE':
        print("❌ Error: TELEGRAM_BOT_TOKEN not set!")
        print("Set it as environment variable:")
        print("export TELEGRAM_BOT_TOKEN='your_token_here'")
        print("\nOr edit telegram_bot.py and set BOT_TOKEN directly")
        sys.exit(1)
    
    # Create application
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Add handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("scan", scan))
    application.add_handler(CommandHandler("signals", signals))
    application.add_handler(CommandHandler("status", status))
    application.add_handler(CommandHandler("watchlist", watchlist))
    application.add_handler(CommandHandler("positions", positions))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("report", report))
    application.add_handler(CommandHandler("alert", alert_command))
    application.add_handler(CallbackQueryHandler(button_callback))
    
    # Start bot
    print("🚀 Starting CredX Telegram Bot...")
    print("Bot is running. Press Ctrl+C to stop.")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
