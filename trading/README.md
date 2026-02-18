# CredX Trading System
## Spike Strategy Scanner & Analysis Tools

### Overview
This is an AI-enhanced day trading system based on the proven "Spike" reversal strategy from 17+ years of trading experience.

### Core Strategy
**The 30-Minute Spike:**
- Price spikes sharply in first 30 minutes
- Spike clears 150%+ of ATR (Average True Range)
- Price closes back inside prior range
- Enter counter-trend on daily, with weekly trend
- Target 50% retracement

### Files

| File | Purpose |
|------|---------|
| `scanner.py` | Detects spike patterns in real-time |
| `ichimoku_analyzer.py` | Cloud positioning for trend alignment |
| `volume_profile.py` | Major support/resistance levels (POC) |
| `run_analysis.py` | Master script - runs all analysis |
| `strategy-analysis.md` | Full strategy playbook |
| `access-requirements.md` | What you need to provide for world-class output |

### Quick Start

```bash
# Run full analysis
cd /root/.openclaw/workspace/credx/trading
python3 run_analysis.py

# Run individual components
python3 scanner.py              # Find spike signals
python3 ichimoku_analyzer.py    # Check cloud positioning
python3 volume_profile.py       # Find volume levels
```

### Dependencies

```bash
pip install yfinance pandas numpy scipy
```

### Default Watchlist
- DG (Dollar General)
- HIMS (Hims & Hers)
- AMED (Amedisys)
- AMD, NVDA, NFLX, INTC
- GOOGL, AMZN, MSFT
- COIN, MSTR

### Data Sources
- **Yahoo Finance** (free, real-time)
- **TradingView** (charts, indicators)
- **Polygon.io** (optional, premium data)

### Next Steps

1. **Add your broker API** for live trading
2. **Set up alerts** (Discord, Telegram, SMS)
3. **Paper trade** the strategy first
4. **Backtest** on your own historical data
5. **Deploy** to cloud for 24/7 scanning

### Risk Warning

⚠️ **Trading involves substantial risk of loss.** 
- Never risk more than you can afford to lose
- Past performance does not guarantee future results
- The 25% daily goal mentioned is extremely aggressive and likely unsustainable
- Professional traders aim for 1-3% daily consistently
- Always use stop losses

### Competition Prep

For the trade-a-thon:
1. Run scanner before market open
2. Check combined analysis scores
3. Only take setups with Score ≥ 5
4. Risk 1-2% per trade
5. Target 2-5% daily (realistic)

### Support

For questions or to add features:
- Check strategy-analysis.md for full details
- Review access-requirements.md for what to provide
- Modify DEFAULT_WATCHLIST in scanner.py for your symbols

---

**Built for:** Trade-a-Thon Competition  
**Strategy Source:** 17+ Years Backtested Edge  
**Last Updated:** 2026-02-17
