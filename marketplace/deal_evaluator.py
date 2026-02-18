#!/usr/bin/env python3
"""
Facebook Marketplace Deal Evaluator
Paste deal details, get instant quality score
"""

import re
from dataclasses import dataclass
from typing import Optional
import json

@dataclass
class Deal:
    category: str
    item_name: str
    retail_price: float
    asking_price: float
    condition: str
    age_years: float
    location: str  # "Bronx" or "Other"
    seller_rating: Optional[float] = None
    has_photos: bool = True
    pickup_ready: bool = True

class DealEvaluator:
    """Evaluates marketplace deals based on multiple criteria"""
    
    # Condition multipliers (affects value)
    CONDITION_MULT = {
        'new': 1.0,
        'like new': 0.95,
        'excellent': 0.90,
        'great': 0.85,
        'good': 0.75,
        'fair': 0.55,
        'poor': 0.30,
        'for parts': 0.15
    }
    
    # Category depreciation rates (annual)
    DEPRECIATION = {
        'phone': 0.30,
        'laptop': 0.25,
        'computer': 0.25,
        'tablet': 0.30,
        'electronics': 0.25,
        'furniture': 0.40,
        'appliance': 0.35,
        'tool': 0.20,
        'bike': 0.25,
        'car': 0.15,
        'clothing': 0.50,
        'collectible': 0.10,
        'other': 0.35
    }
    
    # High-value brands (get better resale)
    PREMIUM_BRANDS = [
        'apple', 'iphone', 'macbook', 'ipad', 'imac',
        'dyson', 'kitchenaid', 'vitamix', 'theragun',
        'trek', 'specialized', 'giant', 'cannondale',
        'herman miller', 'steelcase', 'west elm', 'cb2',
        'deWalt', 'milwaukee', 'makita', 'bosch',
        'sony', 'canon', 'nikon', 'fujifilm',
        'playstation', 'xbox', 'nintendo'
    ]
    
    def calculate_expected_value(self, deal: Deal) -> float:
        """Calculate what item should be worth based on age/condition"""
        
        # Base depreciation
        dep_rate = self.DEPRECIATION.get(deal.category, 0.35)
        expected = deal.retail_price * ((1 - dep_rate) ** deal.age_years)
        
        # Condition adjustment
        cond_mult = self.CONDITION_MULT.get(deal.condition.lower(), 0.5)
        expected *= cond_mult
        
        return expected
    
    def calculate_deal_score(self, deal: Deal) -> dict:
        """
        Calculate comprehensive deal score
        Returns dict with score and breakdown
        """
        scores = {}
        
        # 1. Price Score (0-40 points)
        expected = self.calculate_expected_value(deal)
        price_ratio = deal.asking_price / expected if expected > 0 else 1
        
        if price_ratio <= 0.5:
            scores['price'] = 40
        elif price_ratio <= 0.6:
            scores['price'] = 35
        elif price_ratio <= 0.7:
            scores['price'] = 30
        elif price_ratio <= 0.8:
            scores['price'] = 25
        elif price_ratio <= 0.9:
            scores['price'] = 20
        elif price_ratio <= 1.0:
            scores['price'] = 15
        else:
            scores['price'] = max(0, 15 - (price_ratio - 1) * 20)
        
        # 2. Location Score (0-20 points)
        if 'bronx' in deal.location.lower():
            scores['location'] = 20
        elif any(x in deal.location.lower() for x in ['manhattan', 'queens', 'westchester']):
            scores['location'] = 15
        else:
            scores['location'] = 5
        
        # 3. Condition Score (0-15 points)
        cond_scores = {
            'new': 15, 'like new': 15, 'excellent': 13,
            'great': 12, 'good': 10, 'fair': 6, 'poor': 3
        }
        scores['condition'] = cond_scores.get(deal.condition.lower(), 5)
        
        # 4. Photos/Trust Score (0-15 points)
        scores['trust'] = 15 if deal.has_photos else 5
        
        # 5. Urgency/Availability (0-10 points)
        scores['urgency'] = 10 if deal.pickup_ready else 5
        
        total_score = sum(scores.values())
        
        # Determine deal quality
        if total_score >= 85:
            quality = "🔥 EXCELLENT DEAL - Buy Immediately"
        elif total_score >= 70:
            quality = "✅ GREAT DEAL - Strong Buy"
        elif total_score >= 55:
            quality = "⚠️ GOOD DEAL - Worth Considering"
        elif total_score >= 40:
            quality = "⚡ FAIR DEAL - Negotiate Lower"
        else:
            quality = "❌ SKIP - Overpriced or Risky"
        
        return {
            'total_score': total_score,
            'max_score': 100,
            'breakdown': scores,
            'quality_rating': quality,
            'expected_value': expected,
            'potential_savings': expected - deal.asking_price,
            'savings_percent': ((expected - deal.asking_price) / expected * 100) if expected > 0 else 0
        }
    
    def get_negotiation_strategy(self, deal: Deal, score: dict) -> str:
        """Get negotiation advice based on deal score"""
        
        if score['total_score'] >= 70:
            return f"""
💰 NEGOTIATION STRATEGY:

This is a strong deal. Don't lowball too much.

Opening offer: ${int(deal.asking_price * 0.90)} (10% off)
Target price: ${int(deal.asking_price * 0.95)}
Max price: ${int(deal.asking_price)}

Script:
"Hi! I'm very interested in the [item] and can pick up today/tomorrow 
in [Bronx location]. Would you take ${int(deal.asking_price * 0.90)} 
for immediate cash pickup?"
"""
        elif score['total_score'] >= 55:
            return f"""
💰 NEGOTIATION STRATEGY:

Decent deal room. Offer 15-20% below asking.

Opening offer: ${int(deal.asking_price * 0.80)} (20% off)
Target price: ${int(deal.asking_price * 0.85)}
Max price: ${int(deal.asking_price * 0.95)}

Script:
"Hi, I'm interested in the [item]. I'm local in the Bronx and can 
pick up quickly. Would you consider ${int(deal.asking_price * 0.80)}?"
"""
        else:
            return f"""
💰 NEGOTIATION STRATEGY:

This deal needs work. Offer 25-30% below.

Opening offer: ${int(deal.asking_price * 0.70)} (30% off)
Target price: ${int(deal.asking_price * 0.80)}
Max price: ${int(deal.asking_price * 0.90)}

Only proceed if they accept your low offer.
Script:
"Hi, I can offer ${int(deal.asking_price * 0.70)} cash today for 
the [item]. I understand if that doesn't work for you."
"""
    
    def check_red_flags(self, deal: Deal) -> list:
        """Check for common scam/problem indicators"""
        flags = []
        
        if deal.asking_price < deal.retail_price * 0.2:
            flags.append("⚠️ Price too low - possible scam or stolen")
        
        if deal.asking_price > deal.retail_price * 0.9:
            flags.append("⚠️ Near retail price - not a deal")
        
        if not deal.has_photos:
            flags.append("🚩 No photos - high risk")
        
        if deal.condition.lower() == 'new' and deal.asking_price < deal.retail_price * 0.5:
            flags.append("🚩 "New" item at steep discount - verify authenticity")
        
        if 'shipping' in deal.location.lower():
            flags.append("🚌 Shipping only - FB Marketplace scam risk")
        
        return flags

# Example usage
def evaluate_deal_from_text(text: str) -> dict:
    """
    Parse deal from natural language text
    Example: "iPhone 13 Pro, $400, like new, 1 year old, Bronx"
    """
    
    # Simple parsing (in real use, use NLP or structured input)
    print("\n" + "="*60)
    print("FACEBOOK MARKETPLACE DEAL EVALUATOR")
    print("="*60)
    
    # For interactive use, ask questions
    item = input("What is the item? (e.g., iPhone 13 Pro): ")
    
    retail_input = input("Retail price (MSRP)? $")
    retail = float(retail_input) if retail_input else 0
    
    asking_input = input("Asking price? $")
    asking = float(asking_input) if asking_input else 0
    
    print("\nCondition options:")
    print("1. New/Like New")
    print("2. Excellent")
    print("3. Good")
    print("4. Fair")
    print("5. Poor")
    cond_choice = input("Condition (1-5): ")
    conditions = ['like new', 'excellent', 'good', 'fair', 'poor']
    condition = conditions[int(cond_choice)-1] if cond_choice.isdigit() and 1 <= int(cond_choice) <= 5 else 'good'
    
    age = input("How old (years)? ")
    age = float(age) if age else 1
    
    location = input("Location (Bronx/Other)? ")
    
    # Detect category
    item_lower = item.lower()
    if any(x in item_lower for x in ['iphone', 'phone', 'pixel', 'samsung']):
        category = 'phone'
    elif any(x in item_lower for x in ['macbook', 'laptop', 'computer', 'pc']):
        category = 'laptop'
    elif any(x in item_lower for x in ['couch', 'table', 'chair', 'bed', 'dresser']):
        category = 'furniture'
    elif any(x in item_lower for x in ['playstation', 'xbox', 'nintendo', 'game']):
        category = 'electronics'
    elif any(x in item_lower for x in ['bike', 'bicycle']):
        category = 'bike'
    else:
        category = 'other'
    
    deal = Deal(
        category=category,
        item_name=item,
        retail_price=retail,
        asking_price=asking,
        condition=condition,
        age_years=age,
        location=location
    )
    
    evaluator = DealEvaluator()
    result = evaluator.calculate_deal_score(deal)
    
    print("\n" + "="*60)
    print("EVALUATION RESULTS")
    print("="*60)
    print(f"\n📦 Item: {item}")
    print(f"💵 Asking: ${asking:.0f} | Retail: ${retail:.0f}")
    print(f"📊 Expected Value: ${result['expected_value']:.0f}")
    print(f"💰 Potential Savings: ${result['potential_savings']:.0f} ({result['savings_percent']:.0f}%)")
    print(f"\n⭐ DEAL SCORE: {result['total_score']}/100")
    print(f"📈 Rating: {result['quality_rating']}")
    
    print("\n📋 Score Breakdown:")
    for criterion, score in result['breakdown'].items():
        print(f"   {criterion.capitalize()}: {score} points")
    
    # Red flags
    flags = evaluator.check_red_flags(deal)
    if flags:
        print("\n🚩 RED FLAGS:")
        for flag in flags:
            print(f"   {flag}")
    
    # Negotiation advice
    strategy = evaluator.get_negotiation_strategy(deal, result)
    print(strategy)
    
    return result

if __name__ == '__main__':
    print("Facebook Marketplace Deal Evaluator")
    print("Enter deal details to get instant analysis\n")
    
    while True:
        evaluate_deal_from_text("")
        
        again = input("\nEvaluate another deal? (y/n): ")
        if again.lower() != 'y':
            break
    
    print("\nHappy deal hunting! 🎯")
