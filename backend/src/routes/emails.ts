import { Router } from 'express';
import prisma from '../utils/prisma';

const router = Router();

// Email templates for the 5-day masterclass
export const EMAIL_TEMPLATES = {
  welcome: {
    subject: 'Welcome to the 5-Day Credit Masterclass! 🎓',
    body: `
Hi {{firstName}},

Welcome to the CredX 5-Day Credit Masterclass! I'm James Malloy, and I'm excited to help you take control of your credit.

**What happens next:**
📧 Day 1 starts tomorrow morning
📱 Join our private community: https://facebook.com/groups/credx  
📊 Download your Credit Action Worksheet: https://credxme.com/worksheet

**Quick wins while you wait:**
1. Get your free credit reports at AnnualCreditReport.com
2. Sign up for free credit monitoring (Credit Karma or Experian)
3. Join our community and introduce yourself

**Your next 5 days:**
Day 1: Understanding Your Credit Report
Day 2: Dispute Strategies That Work
Day 3: Building Positive Credit History  
Day 4: Advanced Tactics for Deletions
Day 5: Maintaining Your New Score

Let's do this!

James Malloy
Founder, CredX
(866) 273-3963
contact@credxme.com

P.S. If you have questions, just reply to this email. I read every single one.
    `
  },
  
  day1: {
    subject: 'Day 1: Understanding Your Credit Report 📊',
    body: `
Hi {{firstName}},

Welcome to Day 1 of your Credit Masterclass!

**Today's Focus: Understanding Your Credit Report**

Before you can fix your credit, you need to know what's broken. Today we'll cover:

1. **How to get your reports (free)**
   → Go to AnnualCreditReport.com
   → Request from all 3 bureaus
   → Download and save the PDFs

2. **How to read your report**
   - Personal information section
   - Account history (this is where the damage is)
   - Inquiries (hard vs soft)
   - Public records

3. **Identifying errors**
   - Accounts you don't recognize
   - Late payments that are wrong
   - Duplicate accounts
   - Incorrect balances

**Your Action Items:**
✅ Pull all 3 credit reports
✅ Download the Credit Report Analysis Worksheet
✅ Identify at least 3 errors or negative items

**Resource of the Day:**
Video: "How to Read Your Credit Report Like a Pro" (15 min)
[VIDEO LINK]

Tomorrow: Dispute strategies that actually work.

Talk soon,
James

P.S. Join 2,000+ students in our community sharing their progress: [LINK]
    `
  },
  
  day2: {
    subject: 'Day 2: Dispute Strategies That Work 🎯',
    body: `
Hi {{firstName}},

Day 2 is here! Today we're talking about the most powerful tool in credit repair: disputes.

**The Truth About Disputes:**

Most people do this wrong. They send a generic letter saying "this isn't mine." That rarely works.

**The 3 Types of Disputes:**

1. **Factual Dispute** (Most Effective)
   - "This account shows a late payment on 3/2022, but I have bank records showing payment on 3/15/2022"
   - Use when you have proof

2. **Procedural Dispute**
   - "This collection account lacks required validation under FDCPA 809"
   - Use when they can't verify

3. **Identity Theft Dispute**
   - "I did not open this account. Here is my police report."
   - Use for fraud only

**The Dispute Process:**
1. Write specific dispute letters
2. Send certified mail, return receipt
3. Wait 30 days for response
4. If verified, escalate to Round 2
5. If deleted, celebrate!

**Your Templates:**
I've attached dispute templates for:
- Late payment removal
- Collection deletion
- Inquiry removal
- Charge-off deletion

**Action Items:**
✅ Choose 3 negative items to dispute
✅ Customize your dispute letters
✅ Mail them certified this week

Tomorrow: Building positive credit history.

James

P.S. Want us to handle your disputes? Check out our Aggressive Repair plan: [LINK]
    `
  },
  
  day3: {
    subject: 'Day 3: Building Positive Credit History 💪',
    body: `
Hi {{firstName}},

While we're deleting negative items, we also need to ADD positive history.

**Why This Matters:**
Your credit score is 35% payment history. If you only have negative accounts, adding positive ones dilutes the damage.

**Fastest Ways to Build Credit:**

1. **Authorized User Tradelines** (Instant)
   - Get added to someone's old, high-limit card
   - Their history appears on your report
   - Can boost score 50-100 points immediately
   
2. **Secured Credit Card** (2-3 months)
   - Put down $200-$500 deposit
   - Use it for gas/groceries only
   - Pay in full every month
   
3. **Credit Builder Loan** (6-24 months)
   - Save money while building credit
   - Reports as installment loan
   - Good mix of credit types

4. **Rent Reporting** (2-4 weeks)
   - Add 24 months of rent history
   - Average 40-point boost
   - One-time fee, reports monthly

**My Recommendation:**
Start with rent reporting (fastest boost) + secured card (long-term building).

**Links to get started:**
- Rent reporting: [AFFILIATE LINK]
- Secured cards: [AFFILIATE LINK]
- Credit builder loans: [AFFILIATE LINK]

**Action Items:**
✅ Sign up for rent reporting
✅ Apply for one secured card
✅ Set autopay so you never miss a payment

Tomorrow: Advanced tactics for stubborn deletions.

James
    `
  },
  
  day4: {
    subject: 'Day 4: Advanced Tactics for Deletions 🚀',
    body: `
Hi {{firstName}},

Some negative items are stubborn. Today: advanced tactics for the items that won't budge.

**Tactic 1: Method of Verification (MOV)**

When a bureau verifies a negative item, demand to know HOW they verified it.

"Pursuant to FCRA § 611(a)(6), please provide the method of verification used to confirm this account."

Bureaus often can't produce this, forcing deletion.

**Tactic 2: 609 Letter**

Request the actual documents the creditor provided:

"Under FCRA § 609, I request all information in your files regarding account [number], including but not limited to: signed contracts, payment history, and assignment documentation."

If they can't produce the original signed contract, they can't verify.

**Tactic 3: CFPB Complaint**

If bureaus won't delete verifiable errors:
1. File complaint at ConsumerFinance.gov
2. Bureaus have 15 days to respond
3. They often delete rather than fight

**Tactic 4: Pay for Delete**

For legitimate collections:
"I will pay $X in exchange for complete deletion of this account from all credit reports."

Get it in writing BEFORE paying.

**Tactic 5: Goodwill Letters**

For legitimate late payments (especially if you're now current):
"I had a hardship [explain briefly]. I've been current for [X] months. Please remove this as a goodwill gesture."

Works best with smaller banks/credit unions.

**Action Items:**
✅ Send MOV requests for verified items
✅ File CFPB complaint if needed
✅ Draft goodwill letters for legitimate lates

Tomorrow: Maintaining your new score for life.

James

P.S. These tactics require persistence. Most people give up too soon. Don't be most people.
    `
  },
  
  day5: {
    subject: 'Day 5: Maintaining Your New Score + Your Next Steps 🎉',
    body: `
Hi {{firstName}},

You made it! Day 5 of the Credit Masterclass.

**Today: Keeping Your Score High**

The habits that keep you above 700:

1. **Pay on time, always**
   - Set autopay for minimums
   - One late = 100+ point drop
   
2. **Keep utilization under 10%**
   - $1000 limit = $100 max balance
   - Pay before statement date
   
3. **Don't close old cards**
   - Age of credit matters
   - Keep oldest cards open
   
4. **Limit hard inquiries**
   - 1 inquiry = ~5 points
   - Multiple in 14 days = 1 inquiry
   
5. **Monitor monthly**
   - Check all 3 bureaus
   - Dispute errors immediately

**Your 90-Day Action Plan:**

Days 1-30: Dispute rounds 1, add positive tradelines
Days 31-60: Review responses, send round 2 disputes
Days 61-90: Goodwill letters, CFPB complaints if needed

**Expected Results:**
- 30 days: First deletions
- 60 days: 20-40 point boost
- 90 days: 50-100+ point boost

**Your Options Now:**

1. **Continue DIY** (Free)
   - Keep using these strategies
   - Join our community for support
   - Watch your score climb

2. **Let Us Handle It** (Aggressive Repair - $500)
   - We do all the work
   - 90-day guarantee (+75 points)
   - You focus on life, not credit

[Schedule Free Consultation] [LINK]

**Finally:**

I started CredX because I believe everyone deserves a second chance. Credit problems don't make you a bad person—they usually mean life happened.

You've got the knowledge now. Execute on it. Your future self will thank you.

Questions? Just reply.

To your success,
James Malloy
Founder, CredX

P.S. Know someone struggling with credit? Forward them this course: [SHARE LINK]
    `
  },
  
  followUp1: {
    subject: 'How are your disputes going?',
    body: `
Hi {{firstName}},

It's been 2 weeks since you started the masterclass.

Quick question: Have you sent your dispute letters yet?

If yes → Great! You should hear back in 2-3 weeks.

If no → What's holding you back? 

Common roadblocks:
- Don't have credit reports yet?
- Not sure which items to dispute?
- Need help with the letters?

Hit reply and let me know. I'm here to help.

James

P.S. If DIY feels overwhelming, our Aggressive Repair service handles everything for $500 with a 90-day guarantee. Book a call: [LINK]
    `
  },
  
  followUp2: {
    subject: 'Your credit score update (60 days later)',
    body: `
Hi {{firstName}},

60 days ago you started this journey.

By now, you should have:
✅ Sent at least one round of disputes
✅ Added positive tradelines
✅ Seen some deletions or score changes

**What's your current situation?**

If you're seeing results → Keep going! Round 2 disputes go out now.

If you're stuck → Let's talk. Book a free strategy call: [LINK]

**Remember:** Credit repair is a marathon, not a sprint. Most people see the biggest gains in months 3-6.

Keep pushing.

James
    `
  }
};

// Schedule email to be sent
router.post('/schedule', async (req, res) => {
  try {
    const { userId, emailType, scheduledFor } = req.body;
    
    // Here you would integrate with your email service (SendGrid, etc.)
    // For now, we'll log it
    console.log(`Scheduled ${emailType} email for user ${userId} at ${scheduledFor}`);
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'EMAIL_SCHEDULED',
        entity: 'Email',
        details: { emailType, scheduledFor }
      }
    });
    
    res.json({ success: true, message: 'Email scheduled' });
  } catch (error) {
    console.error('Error scheduling email:', error);
    res.status(500).json({ error: 'Failed to schedule email' });
  }
});

// Trigger masterclass sequence for a new lead
router.post('/start-masterclass', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { clientProfile: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Schedule the email sequence
    const now = new Date();
    const schedule = [
      { type: 'welcome', days: 0 },
      { type: 'day1', days: 1 },
      { type: 'day2', days: 2 },
      { type: 'day3', days: 3 },
      { type: 'day4', days: 4 },
      { type: 'day5', days: 5 },
      { type: 'followUp1', days: 14 },
      { type: 'followUp2', days: 60 }
    ];
    
    for (const item of schedule) {
      const scheduledDate = new Date(now);
      scheduledDate.setDate(scheduledDate.getDate() + item.days);
      
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'MASTERCLASS_EMAIL_SCHEDULED',
          entity: 'EmailSequence',
          details: { 
            emailType: item.type, 
            scheduledFor: scheduledDate,
            template: EMAIL_TEMPLATES[item.type as keyof typeof EMAIL_TEMPLATES]?.subject
          }
        }
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Masterclass email sequence scheduled',
      schedule: schedule.map(s => ({
        ...s,
        scheduledFor: new Date(now.getTime() + s.days * 24 * 60 * 60 * 1000)
      }))
    });
    
  } catch (error) {
    console.error('Error starting masterclass:', error);
    res.status(500).json({ error: 'Failed to start masterclass' });
  }
});

export default router;
export { EMAIL_TEMPLATES };
