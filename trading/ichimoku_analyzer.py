#!/usr/bin/env python3
"""
Ichimoku Cloud Analyzer
Detects cloud positioning for trend analysis
"""

import yfinance as yf
import pandas as pd
import numpy as np

class IchimokuAnalyzer:
    def __init__(self, tenkan=9, kijun=26, senkou_b=52):
        self.tenkan = tenkan      # Conversion line
        self.kijun = kijun        # Base line  
        self.senkou_b = senkou_b  # Leading span B
        
    def calculate(self, df):
        """Calculate Ichimoku components"""
        # Tenkan-sen (Conversion Line): (9-period high + 9-period low)/2
        tenkan_sen = (df['High'].rolling(self.tenkan).max() + 
                      df['Low'].rolling(self.tenkan).min()) / 2
        
        # Kijun-sen (Base Line): (26-period high + 26-period low)/2
        kijun_sen = (df['High'].rolling(self.kijun).max() + 
                     df['Low'].rolling(self.kijun).min()) / 2
        
        # Senkou Span A (Leading Span A): (Conversion Line + Base Line)/2
        senkou_span_a = ((tenkan_sen + kijun_sen) / 2).shift(self.kijun)
        
        # Senkou Span B (Leading Span B): (52-period high + 52-period low)/2
        senkou_span_b = ((df['High'].rolling(self.senkou_b).max() + 
                          df['Low'].rolling(self.senkou_b).min()) / 2).shift(self.kijun)
        
        # Chikou Span (Lagging Span): Current close shifted back 26 periods
        chikou_span = df['Close'].shift(-self.kijun)
        
        return pd.DataFrame({
            'Tenkan': tenkan_sen,
            'Kijun': kijun_sen,
            'SenkouA': senkou_span_a,
            'SenkouB': senkou_span_b,
            'Chikou': chikou_span
        })
    
    def get_cloud_position(self, df, timeframe="daily"):
        """
        Determine price position relative to cloud
        Returns: 'above', 'below', or 'inside'
        """
        ichimoku = self.calculate(df)
        
        current_price = df['Close'].iloc[-1]
        senkou_a = ichimoku['SenkouA'].iloc[-1]
        senkou_b = ichimoku['SenkouB'].iloc[-1]
        
        # Cloud is between Senkou A and B
        cloud_top = max(senkou_a, senkou_b)
        cloud_bottom = min(senkou_a, senkou_b)
        
        if current_price > cloud_top:
            return 'above'
        elif current_price < cloud_bottom:
            return 'below'
        else:
            return 'inside'
    
    def get_trend_alignment(self, symbol):
        """
        Check daily vs weekly trend alignment for Spike Strategy
        Returns dict with cloud positions
        """
        try:
            ticker = yf.Ticker(symbol)
            
            # Daily timeframe
            daily = ticker.history(period="3mo", interval="1d")
            daily_ichimoku = self.calculate(daily)
            daily_position = self.get_cloud_position(daily, "daily")
            
            # Weekly timeframe
            weekly = ticker.history(period="1y", interval="1wk")
            weekly_ichimoku = self.calculate(weekly)
            weekly_position = self.get_cloud_position(weekly, "weekly")
            
            return {
                'symbol': symbol,
                'daily_cloud': daily_position,
                'weekly_cloud': weekly_position,
                'spike_setup': daily_position == 'below' and weekly_position == 'above',
                'current_price': daily['Close'].iloc[-1],
                'kijun_daily': daily_ichimoku['Kijun'].iloc[-1],
                'kijun_weekly': weekly_ichimoku['Kijun'].iloc[-1]
            }
            
        except Exception as e:
            return {'symbol': symbol, 'error': str(e)}

def analyze_watchlist(symbols):
    """Analyze cloud positioning for watchlist"""
    analyzer = IchimokuAnalyzer()
    results = []
    
    print("="*70)
    print("ICHIMOKU CLOUD ANALYSIS")
    print("="*70)
    print(f"{'Symbol':<10} {'Price':<10} {'Daily':<10} {'Weekly':<10} {'Spike Setup':<12}")
    print("-"*70)
    
    for symbol in symbols:
        result = analyzer.get_trend_alignment(symbol)
        if 'error' not in result:
            spike_ok = "✅ YES" if result['spike_setup'] else "❌ NO"
            print(f"{result['symbol']:<10} ${result['current_price']:<9.2f} "
                  f"{result['daily_cloud']:<10} {result['weekly_cloud']:<10} {spike_ok:<12}")
            results.append(result)
        else:
            print(f"{symbol:<10} ERROR")
    
    print("="*70)
    print("\nSPIKE SETUP = Below cloud on Daily + Above cloud on Weekly")
    print("(Counter-trend on daily, trend-following on weekly)")
    
    return results

if __name__ == "__main__":
    from scanner import DEFAULT_WATCHLIST
    analyze_watchlist(DEFAULT_WATCHLIST)
