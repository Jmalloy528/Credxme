#!/usr/bin/env python3
"""
Volume Profile Analyzer
Detects Point of Control (POC) and value areas
"""

import yfinance as yf
import pandas as pd
import numpy as np
from scipy import stats

class VolumeProfileAnalyzer:
    def __init__(self, bins=50):
        self.bins = bins
        
    def calculate(self, df):
        """
        Calculate volume profile
        Returns: POC (Point of Control), Value Area High/Low
        """
        # Create price bins
        price_min = df['Low'].min()
        price_max = df['High'].max()
        bin_edges = np.linspace(price_min, price_max, self.bins)
        
        # Calculate volume per bin
        volume_profile = []
        for i in range(len(bin_edges)-1):
            mask = (df['Close'] >= bin_edges[i]) & (df['Close'] < bin_edges[i+1])
            volume = df.loc[mask, 'Volume'].sum()
            mid_price = (bin_edges[i] + bin_edges[i+1]) / 2
            volume_profile.append({
                'price_level': mid_price,
                'volume': volume,
                'bin_low': bin_edges[i],
                'bin_high': bin_edges[i+1]
            })
        
        vp_df = pd.DataFrame(volume_profile)
        
        if vp_df.empty:
            return None
            
        # Point of Control = highest volume node
        poc_idx = vp_df['volume'].idxmax()
        poc = vp_df.loc[poc_idx, 'price_level']
        
        # Value Area (70% of volume)
        total_volume = vp_df['volume'].sum()
        vp_df['volume_pct'] = vp_df['volume'] / total_volume
        vp_df_sorted = vp_df.sort_values('volume', ascending=False)
        vp_df_sorted['cumsum_pct'] = vp_df_sorted['volume_pct'].cumsum()
        
        value_area = vp_df_sorted[vp_df_sorted['cumsum_pct'] <= 0.70]
        va_high = value_area['price_level'].max()
        va_low = value_area['price_level'].min()
        
        return {
            'poc': poc,
            'value_area_high': va_high,
            'value_area_low': va_low,
            'total_volume': total_volume,
            'price_range': price_max - price_min,
            'volume_profile': vp_df
        }
    
    def find_major_levels(self, symbol, lookback_years=2):
        """Find major volume profile levels over multiple years"""
        try:
            ticker = yf.Ticker(symbol)
            # Get multi-year weekly data for major levels
            df = ticker.history(period=f"{lookback_years}y", interval="1wk")
            
            if df.empty:
                return None
                
            vp = self.calculate(df)
            if not vp:
                return None
                
            current_price = df['Close'].iloc[-1]
            
            # Calculate distance to POC
            distance_to_poc = abs(current_price - vp['poc']) / current_price
            
            return {
                'symbol': symbol,
                'current_price': current_price,
                'poc': vp['poc'],
                'value_area_high': vp['value_area_high'],
                'value_area_low': vp['value_area_low'],
                'distance_to_poc_pct': distance_to_poc * 100,
                'near_poc': distance_to_poc < 0.05,  # Within 5%
                'in_value_area': vp['value_area_low'] <= current_price <= vp['value_area_high']
            }
            
        except Exception as e:
            return {'symbol': symbol, 'error': str(e)}

def analyze_volume_levels(symbols):
    """Analyze volume profile for watchlist"""
    analyzer = VolumeProfileAnalyzer()
    
    print("="*80)
    print("VOLUME PROFILE ANALYSIS (2-Year Weekly)")
    print("="*80)
    print(f"{'Symbol':<10} {'Price':<10} {'POC':<10} {'Dist%':<8} {'Near POC':<10} {'In VA':<8}")
    print("-"*80)
    
    results = []
    for symbol in symbols:
        result = analyzer.find_major_levels(symbol)
        if result and 'error' not in result:
            near_poc = "✅ YES" if result['near_poc'] else "NO"
            in_va = "✅ YES" if result['in_value_area'] else "NO"
            print(f"{result['symbol']:<10} ${result['current_price']:<9.2f} "
                  f"${result['poc']:<9.2f} {result['distance_to_poc_pct']:<7.1f}% "
                  f"{near_poc:<10} {in_va:<8}")
            results.append(result)
        else:
            print(f"{symbol:<10} ERROR")
    
    print("="*80)
    print("\nPOC = Point of Control (highest volume price)")
    print("Near POC = Within 5% of major volume level (good for reversals)")
    print("In VA = Inside Value Area (70% of volume traded here)")
    
    return results

if __name__ == "__main__":
    from scanner import DEFAULT_WATCHLIST
    analyze_volume_levels(DEFAULT_WATCHLIST)
