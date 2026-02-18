#!/usr/bin/env python3
"""
Scheduled Report Sender for Telegram
Send daily trading reports automatically
"""

import os
import json
import asyncio
from datetime import datetime
from telegram import Bot

BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', 'YOUR_BOT_TOKEN_HERE')
USER_ID = os.getenv('TELEGRAM_USER_ID', 'YOUR_USER_ID_HERE')
TRADING_DIR = '/root/.openclaw/workspace/credx/trading'

async def send_daily_report():
    """Send daily trading report"""
    bot = Bot(token=BOT_TOKEN)
    
    try:
        # Load analysis data
        with open(f'{TRADING_DIR}/daily_analysis.json', 'r') as f:
            data = json.load(f)
        
        timestamp = data.get('timestamp', 'Unknown')
        signals = data.get('spike_signals', [])
        setups = data.get('combined', [])
        
        # Build report message
        msg = f"""
📊 **DAILY TRADING REPORT**
{datetime.now().strftime('%Y-%m-%d %H:%M')} UTC

**Market Summary:**
🚨 Spike Signals: {len(signals)}
🎯 High-Conviction: {len(setups)}
"""
        
        if setups:
            msg += "\n**Top Setups:**\n"
            for setup in setups[:3]:
                msg += f"\n🎯 {setup['symbol']} (Score: {setup['score']}/9)"
                msg += f"\n   ${setup['price']:.2f} | {', '.join(setup['reasons'])}"
        else:
            msg += "\n⚠️ No high-conviction setups today"
        
        # Send message
        await bot.send_message(
            chat_id=USER_ID,
            text=msg,
            parse_mode='Markdown'
        )
        
        print(f"✅ Report sent at {datetime.now()}")
        
    except Exception as e:
        print(f"❌ Error sending report: {e}")
        # Send error notification
        await bot.send_message(
            chat_id=USER_ID,
            text=f"⚠️ Error generating report: {str(e)}"
        )

if __name__ == '__main__':
    if BOT_TOKEN == 'YOUR_BOT_TOKEN_HERE' or USER_ID == 'YOUR_USER_ID_HERE':
        print("❌ Error: Set TELEGRAM_BOT_TOKEN and TELEGRAM_USER_ID")
        exit(1)
    
    asyncio.run(send_daily_report())
