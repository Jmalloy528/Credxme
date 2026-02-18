#!/usr/bin/env python3
"""
Master Trading System Runner
Executes all scanners and analysis tools
"""

import sys
import os
sys.path.insert(0, '/root/.openclaw/workspace/credx/trading')

from scanner import SpikeScanner, DEFAULT_WATCHLIST
from ichimoku_analyzer import IchimokuAnalyzer, analyze_watchlist
from volume_profile import VolumeProfileAnalyzer, analyze_volume_levels
import json
from datetime import datetime

def run_full_analysis():
    """Run complete trading system analysis"""
    
    print("\n" + "="*80)
    print("CREDX TRADING SYSTEM - FULL ANALYSIS")
    print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} UTC")
    print("="*80 + "\n")
    
    # 1. Scan for spike signals
    print("\n📊 STEP 1: SCANNING FOR SPIKE SIGNALS...")
    print("-"*80)
    scanner = SpikeScanner(atr_threshold=1.5)
    
    all_signals = []
    for symbol in DEFAULT_WATCHLIST[:10]:  # First 10 for speed
        signals = scanner.scan_stock(symbol)
        all_signals.extend(signals)
    
    if all_signals:
        print(f"✅ Found {len(all_signals)} spike signals!")
        for sig in all_signals[:3]:  # Show top 3
            print(f"\n🚨 {sig['symbol']} - {sig['type']}")
            print(f"   ATR Clearance: {sig['atr_clearance']:.2f}x")
            print(f"   Target: ${sig['target_50pct']:.2f}")
    else:
        print("❌ No spike signals found in current session")
    
    # 2. Ichimoku Analysis
    print("\n\n📈 STEP 2: ICHIMOKU CLOUD ANALYSIS...")
    print("-"*80)
    ichimoku_results = analyze_watchlist(DEFAULT_WATCHLIST[:10])
    
    spike_setups = [r for r in ichimoku_results if r.get('spike_setup')]
    if spike_setups:
        print(f"\n✅ {len(spike_setups)} symbols meet Spike Strategy criteria:")
        for s in spike_setups:
            print(f"   {s['symbol']} - ${s['current_price']:.2f}")
    
    # 3. Volume Profile
    print("\n\n📊 STEP 3: VOLUME PROFILE ANALYSIS...")
    print("-"*80)
    vp_results = analyze_volume_levels(DEFAULT_WATCHLIST[:10])
    
    near_poc = [r for r in vp_results if r.get('near_poc')]
    if near_poc:
        print(f"\n⚠️  {len(near_poc)} symbols near major volume levels:")
        for s in near_poc:
            print(f"   {s['symbol']} - POC: ${s['poc']:.2f} ({s['distance_to_poc_pct']:.1f}% away)")
    
    # 4. Combined Analysis
    print("\n\n🎯 STEP 4: COMBINED SIGNAL ANALYSIS...")
    print("-"*80)
    
    # Find symbols that meet multiple criteria
    combined = []
    for symbol in DEFAULT_WATCHLIST[:10]:
        ichimoku = next((r for r in ichimoku_results if r['symbol'] == symbol), {})
        vp = next((r for r in vp_results if r['symbol'] == symbol), {})
        spike = next((s for s in all_signals if s['symbol'] == symbol), None)
        
        score = 0
        reasons = []
        
        if ichimoku.get('spike_setup'):
            score += 3
            reasons.append("Ichimoku Setup")
        if vp.get('near_poc'):
            score += 2
            reasons.append("Near POC")
        if spike:
            score += 4
            reasons.append("Active Spike")
        
        if score >= 2:
            combined.append({
                'symbol': symbol,
                'score': score,
                'reasons': reasons,
                'price': ichimoku.get('current_price', 0)
            })
    
    # Sort by score
    combined.sort(key=lambda x: x['score'], reverse=True)
    
    if combined:
        print("\n🚀 HIGH PRIORITY SETUPS (Score > 2):")
        for c in combined[:5]:
            print(f"\n   {c['symbol']} - Score: {c['score']}/9")
            print(f"   Price: ${c['price']:.2f}")
            print(f"   Reasons: {', '.join(c['reasons'])}")
    else:
        print("\n⚠️  No high-conviction setups found")
    
    # Save results
    results = {
        'timestamp': datetime.now().isoformat(),
        'spike_signals': all_signals,
        'ichimoku': ichimoku_results,
        'volume_profile': vp_results,
        'combined': combined
    }
    
    with open('/root/.openclaw/workspace/credx/trading/daily_analysis.json', 'w') as f:
        json.dump(results, f, indent=2, default=str)
    
    print("\n\n" + "="*80)
    print("✅ ANALYSIS COMPLETE")
    print(f"Results saved to: daily_analysis.json")
    print("="*80 + "\n")
    
    return results

if __name__ == "__main__":
    run_full_analysis()
