#!/usr/bin/env python3
"""
Spike Scanner - Day Trading Strategy
Detects 30-minute spike reversals with ATR clearance
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import time
import sys

class SpikeScanner:
    def __init__(self, atr_threshold=1.5, timeframe="30m"):
        self.atr_threshold = atr_threshold  # 150% ATR
        self.timeframe = timeframe
        self.signals = []
        
    def calculate_atr(self, df, period=14):
        """Calculate Average True Range"""
        high_low = df['High'] - df['Low']
        high_close = np.abs(df['High'] - df['Close'].shift())
        low_close = np.abs(df['Low'] - df['Close'].shift())
        ranges = pd.concat([high_low, high_close, low_close], axis=1)
        true_range = np.max(ranges, axis=1)
        atr = true_range.rolling(period).mean()
        return atr
    
    def detect_spike(self, df):
        """Detect spike pattern"""
        signals = []
        
        # Need at least 30 minutes of data
        if len(df) < 2:
            return signals
            
        atr = self.calculate_atr(df)
        
        for i in range(1, len(df)):
            current = df.iloc[i]
            previous = df.iloc[i-1]
            current_atr = atr.iloc[i]
            
            # Calculate spike size
            spike_size = previous['Low'] - current['Low']
            atr_clearance = spike_size / current_atr if current_atr > 0 else 0
            
            # Check for bullish spike (long opportunity)
            if atr_clearance >= self.atr_threshold:
                # Check if closed back inside range
                if current['Close'] > previous['Low']:
                    signals.append({
                        'timestamp': current.name,
                        'type': 'BULLISH_SPIKE',
                        'symbol': df.index.name,
                        'spike_size': spike_size,
                        'atr_clearance': atr_clearance,
                        'close': current['Close'],
                        'target_50pct': previous['Low'] + (spike_size * 0.5),
                        'stop_loss': current['Low'] * 0.995
                    })
        
        return signals
    
    def scan_stock(self, symbol, period="5d", interval="30m"):
        """Scan a single stock for spikes"""
        try:
            ticker = yf.Ticker(symbol)
            df = ticker.history(period=period, interval=interval)
            
            if df.empty:
                return []
                
            df.index.name = symbol
            signals = self.detect_spike(df)
            return signals
            
        except Exception as e:
            print(f"Error scanning {symbol}: {e}")
            return []
    
    def scan_watchlist(self, symbols):
        """Scan multiple stocks"""
        all_signals = []
        
        for symbol in symbols:
            print(f"Scanning {symbol}...")
            signals = self.scan_stock(symbol)
            all_signals.extend(signals)
            time.sleep(0.5)  # Rate limit
            
        return all_signals
    
    def format_alert(self, signal):
        """Format signal for alert"""
        return f"""
🚨 SPIKE ALERT: {signal['type']}
Symbol: {signal['symbol']}
Time: {signal['timestamp']}
ATR Clearance: {signal['atr_clearance']:.2f}x (Target: >1.5x)
Current Price: ${signal['close']:.2f}
Target (50%): ${signal['target_50pct']:.2f}
Stop Loss: ${signal['stop_loss']:.2f}
Risk/Reward: 1:1.5
"""

# Default watchlist from the strategy
DEFAULT_WATCHLIST = [
    "DG",     # Dollar General
    "HIMS",   # Hims & Hers
    "AMED",   # Amedisys
    "AMD",    # AMD
    "NVDA",   # Nvidia
    "NFLX",   # Netflix
    "INTC",   # Intel
    "GOOGL",  # Google
    "AMZN",   # Amazon
    "MSFT",   # Microsoft
    "COIN",   # Coinbase
    "MSTR",   # MicroStrategy
    "WMT",    # Walmart
    "UNH",    # UnitedHealth
    "PANW",   # Palo Alto Networks
]

def main():
    scanner = SpikeScanner(atr_threshold=1.5)
    
    print("="*60)
    print("SPIKE SCANNER - Day Trading Strategy")
    print("="*60)
    print(f"Scanning {len(DEFAULT_WATCHLIST)} stocks...")
    print(f"ATR Threshold: {scanner.atr_threshold}x")
    print(f"Timeframe: 30-minute")
    print("="*60)
    
    signals = scanner.scan_watchlist(DEFAULT_WATCHLIST)
    
    if signals:
        print(f"\n✅ FOUND {len(signals)} SPIKE SIGNALS:\n")
        for signal in signals:
            print(scanner.format_alert(signal))
    else:
        print("\n❌ No spike signals found in current session.")
        print("Market may be ranging or no setups meeting criteria.")
    
    # Save results
    with open('/root/.openclaw/workspace/credx/trading/scanner_results.json', 'w') as f:
        json.dump(signals, f, indent=2, default=str)
    
    print(f"\nResults saved to: scanner_results.json")

if __name__ == "__main__":
    main()
