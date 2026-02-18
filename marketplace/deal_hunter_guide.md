# Facebook Marketplace Deal Hunter - System Blueprint
## Bronx, NY Local Deal Finder

---

## THE CHALLENGE

Facebook Marketplace **actively blocks scraping**. They have:
- Anti-bot detection
- Rate limiting
- CAPTCHA walls
- No official API

**What works:**
- Browser automation (with care)
- Saved search notifications
- Manual + semi-automated workflows
- Third-party deal aggregators

---

## SYSTEM COMPONENTS

### 1. LOCATION SETUP

**Bronx, NY Coordinates:**
- Center: 40.8448° N, 73.8648° W
- 10-minute radius ≈ 3-5 miles depending on traffic
- ZIP codes to monitor: 10451-10475, 10499

**Nearby areas to include:**
- Westchester County (Yonkers, Mount Vernon)
- Upper Manhattan (Washington Heights, Inwood)
- Parts of Queens

---

### 2. DEAL CRITERIA DATABASE

**High-Value Categories (Below Market Value):**

| Category | Retail Price | Target Deal Price | Quality Check |
|----------|-------------|-------------------|---------------|
| iPhone 13/14 | $600+ | $300-400 | Screen, battery health |
| MacBook Pro | $1200+ | $600-800 | Cycle count, scratches |
| PS5/Xbox X | $500 | $300-350 | Controller, box |
| Furniture (West Elm/CB2) | $800+ | $200-300 | Photos, brand tags |
| Bicycles (Trek/Specialized) | $800+ | $300-500 | Frame condition |
| KitchenAid Mixer | $400 | $150-200 | Attachments included |
| Dyson Vacuum | $500 | $200-250 | Filter condition |
| Patio Furniture Set | $600+ | $150-250 | Weather damage check |
| Power Tools (DeWalt/Milwaukee) | $400+ | $150-250 | Battery health |
| Designer Bags (Coach/MK) | $300+ | $50-100 | Authenticity check |

**Red Flags (Avoid):**
- Too good to be true prices (scams)
- No photos or stock photos
- "Shipping only" (scams)
- Brand new items at 80% off (stolen)
- Sellers with <1 month account
- Refusal to meet in public

---

### 3. MANUAL WORKFLOW (Recommended)

Since full automation is blocked, here's the efficient hybrid approach:

#### Step 1: Saved Searches
```
Go to Facebook Marketplace
Set location: Bronx, NY + 5 miles
Set category: Electronics/Furniture/etc
Sort by: Recently listed
Price max: [target from table above]
Save search
```

#### Step 2: Browser Bookmarklet
```javascript
javascript:(function(){
  // Auto-refresh every 5 minutes during peak hours
  setTimeout(function(){
    location.reload();
  }, 300000);
  
  // Highlight deals under target price
  var items = document.querySelectorAll('[data-testid="marketplace_search_result_card"]');
  items.forEach(item => {
    var priceText = item.textContent.match(/\$[\d,]+/);
    if(priceText) {
      var price = parseInt(priceText[0].replace(/[$,]/g, ''));
      if(price < 300) {  // Adjust threshold
        item.style.border = '3px solid green';
        item.style.background = '#e8f5e9';
      }
    }
  });
})();
```

Save this as a bookmark. Click it when on Marketplace to highlight deals.

---

### 4. SEMI-AUTOMATED SOLUTION

**What I CAN build:**

#### A. Deal Evaluation Script
```python
# Input: Item details you paste
# Output: Deal quality score

def evaluate_deal(category, retail_price, asking_price, condition, age_years):
    """
    Returns: Deal score 0-100
    """
    
    # Price ratio (lower is better)
    price_ratio = asking_price / retail_price
    
    # Depreciation curve
    if category in ['electronics', 'phones']:
        expected_value = retail_price * (0.7 ** age_years)  # 30% yearly depreciation
    elif category in ['furniture']:
        expected_value = retail_price * (0.6 ** age_years)  # 40% yearly
    else:
        expected_value = retail_price * (0.5 ** age_years)  # 50% yearly
    
    # Condition multipliers
    condition_mult = {
        'like new': 1.0,
        'excellent': 0.9,
        'good': 0.75,
        'fair': 0.5,
        'poor': 0.25
    }
    
    expected_value *= condition_mult.get(condition, 0.5)
    
    # Deal score
    if asking_price <= expected_value * 0.5:
        score = 90 + (expected_value - asking_price) / expected_value * 10
    elif asking_price <= expected_value * 0.75:
        score = 70
    elif asking_price <= expected_value:
        score = 50
    else:
        score = 30
    
    return min(100, max(0, score))
```

#### B. Distance Calculator
```python
from geopy.distance import geodesic

bronx_center = (40.8448, -73.8648)

def check_distance(seller_location):
    """Returns True if within 10 min (3 miles)"""
    distance = geodesic(bronx_center, seller_location).miles
    return distance <= 3.0
```

#### C. Deal Alert System
```python
# Telegram bot integration
# When you find a deal, paste details
# Bot calculates score, checks distance, sends alert

async def evaluate_marketplace_deal(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    User sends: /deal iPhone 14 $350 excellent 1yr 40.8448,-73.8648
    Bot replies: Score: 85/100 - GREAT DEAL - Within 10 min
    """
```

---

### 5. ALTERNATIVE DATA SOURCES

Since Facebook blocks scraping, use these:

#### A. OfferUp API (Unofficial)
```python
# OfferUp has better scraping tolerance
# Search radius: 5 miles from Bronx
# Categories: Electronics, furniture, etc
```

#### B. Craigslist RSS Feeds
```python
# Craigslist has RSS feeds for searches
# Bronx: https://newyork.craigslist.org/search/brx/sss?format=rss
# Parse RSS for new listings
```

#### C. Nextdoor API
- Hyperlocal (neighborhood level)
- Often has moving sales, estate sales
- Better for furniture/appliances

#### D. Estate Sale Sites
- estatesales.net (has API)
- estatesalefinder.com
- Bronx estate sales often = quality items cheap

---

### 6. WHAT I CAN BUILD RIGHT NOW

#### Option 1: Telegram Deal Evaluator
You paste deal details → Bot calculates score → Tells you if it's worth it

#### Option 2: Craigslist Scanner
Monitor Craigslist RSS feeds for Bronx → Alert on matches

#### Option 3: Deal Criteria Checklist
App/form that walks you through evaluating any deal

#### Option 4: Estate Sale Finder
Scrape estate sale sites for Bronx area sales this weekend

---

### 7. BEST PRACTICES FOR BRONX DEALS

**Timing:**
- Best deals: Sunday evenings (people want items gone before work week)
- Estate sales: Friday mornings (first pick)
- End of month: Moving sales
- January: Post-holiday decluttering

**Negotiation Script:**
```
"Hi, I'm interested in [item]. I'm in [Bronx neighborhood] and can pick up 
today/tomorrow. Would you take $[80% of asking] for quick cash pickup?"
```

**Safe Meetup Spots in Bronx:**
- NYPD Precincts (all have safe exchange zones)
- Starbucks/McDonald's with cameras
- Mall parking lots (Bay Plaza)
- Busy gas stations

**Transportation:**
- Bronx has subways but limited for large items
- Rent Home Depot truck: $19 for 75 minutes
- U-Haul cargo van: $19.95 + mileage
- TaskRabbit for pickup/delivery: ~$50-80

---

### 8. SAMPLE DEALS TO HUNT

**This Week in Bronx:**

| Item | Retail | Target | Where to Look |
|------|--------|--------|---------------|
| iPhone 13 Pro | $999 | $400-450 | Facebook, OfferUp |
| MacBook Air M1 | $999 | $500-600 | Craigslist, FB |
| Herman Miller Chair | $1500 | $300-500 | Estate sales |
| Weber Grill | $400 | $100-150 | End of summer |
| Trek Bike | $800 | $300-400 | Spring listings |
| sectional couch | $1200 | $300-400 | Moving sales |

---

### 9. AUTOMATION LIMITATIONS

**What I CANNOT do:**
- Scrape Facebook directly (blocked)
- Access private seller data
- Auto-message sellers (TOS violation)
- Guarantee item quality without photos

**What YOU need to do:**
- Manually browse/save searches
- Message sellers
- Inspect items in person
- Negotiate prices
- Arrange pickup

**What I CAN automate:**
- Deal scoring when you input details
- Distance calculations
- Price comparison to retail
- Alert scheduling
- Best time to buy recommendations

---

### 10. RECOMMENDED SETUP

**For Maximum Deals:**

1. **Facebook Marketplace**
   - Save 5-10 searches with filters
   - Check 3x daily: 8am, 12pm, 6pm
   - Sort by "Newest first"

2. **Craigslist**
   - Use RSS feed in feed reader
   - Auto-refresh every 15 min
   - Keywords: "must sell", "moving", "estate"

3. **OfferUp**
   - App notifications on
   - 5-mile radius
   - Sort by newest

4. **Estate Sales**
   - estatesales.net alerts
   - Bronx + 10 miles
   - Friday morning visits

5. **Nextdoor**
   - Join Bronx neighborhood groups
   - Turn on sale notifications
   - "For Sale" section

---

## BOTTOM LINE

**I cannot fully automate Facebook Marketplace** (they block it), but I can build you:

1. **Deal evaluator** - Paste details, get instant score
2. **Craigslist monitor** - RSS feed scanner for Bronx
3. **Estate sale finder** - Weekend sale aggregator
4. **Deal checklist** - Ensure you don't miss red flags
5. **Pickup optimizer** - Route planning for multiple deals

**Which would be most useful?**
- A) Telegram deal evaluator (paste → score)
- B) Craigslist auto-scanner for Bronx
- C) Estate sale weekend finder
- D) All of the above

**Also need from you:**
- Specific items you're hunting for
- Your Bronx neighborhood (for precise radius)
- Budget range
- Transportation method (car, subway, need delivery)

Then I can build the exact tool you need. 🎯
