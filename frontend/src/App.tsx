import { useState } from 'react'
import './App.css'
import LeadForm from './components/LeadForm'
import FeatureAccordion from './components/FeatureAccordion'
import AffiliateCard from './components/AffiliateCard'
import CreditRepairModal from './components/CreditRepairModal'

function App() {
  const [showForm, setShowForm] = useState(false)
  const [showCreditRepair, setShowCreditRepair] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">CredX</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#masterclass" className="text-slate-600 hover:text-blue-600 font-medium">Free Masterclass</a>
              <a href="#tools" className="text-slate-600 hover:text-blue-600 font-medium">Credit Tools</a>
              <a href="#repair" className="text-slate-600 hover:text-blue-600 font-medium">Credit Repair</a>
              <a href="#business" className="text-slate-600 hover:text-blue-600 font-medium">Business Builder</a>
            </div>
            <button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition"
            >
              Get Free Access
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Free Masterclass */}
      <section id="masterclass" className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-yellow-400 text-blue-900 px-4 py-1 rounded-full text-sm font-bold mb-6">
                🔥 FREE 5-Day Challenge
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Master Your Credit
                <span className="text-yellow-400 block">In Just 5 Days</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands who've transformed their credit scores using our proven DIY system. 
                No credit card required. No strings attached.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Day 1: Understanding Your Credit Report',
                  'Day 2: Dispute Strategies That Work',
                  'Day 3: Building Positive Credit History',
                  'Day 4: Advanced Tactics for Deletions',
                  'Day 5: Maintaining Your New Score'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setShowForm(true)}
                className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 text-lg px-8 py-4 rounded-xl font-bold transition transform hover:scale-105 shadow-lg"
              >
                Start My Free Masterclass →
              </button>
              <p className="text-blue-200 text-sm mt-4">Join 12,000+ students. Instant access via email.</p>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🎓</div>
                  <h3 className="text-2xl font-bold">What You'll Learn</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4 flex items-center gap-4">
                    <span className="text-3xl">📊</span>
                    <div>
                      <div className="font-semibold">Credit Score Secrets</div>
                      <div className="text-sm text-blue-200">The algorithms they don't want you to know</div>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 flex items-center gap-4">
                    <span className="text-3xl">🎯</span>
                    <div>
                      <div className="font-semibold">Dispute Templates</div>
                      <div className="text-sm text-blue-200">Proven letters that get deletions</div>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 flex items-center gap-4">
                    <span className="text-3xl">🚀</span>
                    <div>
                      <div className="font-semibold">Fast Track Methods</div>
                      <div className="text-sm text-blue-200">See results in 30-45 days</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 mb-6">Trusted by over 12,000 students and featured on:</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50">
            <span className="text-2xl font-bold text-slate-400">NerdWallet</span>
            <span className="text-2xl font-bold text-slate-400">Credit Karma</span>
            <span className="text-2xl font-bold text-slate-400">Experian</span>
            <span className="text-2xl font-bold text-slate-400">Forbes</span>
          </div>
        </div>
      </section>

      {/* Credit Builder Tools - Affiliate Section */}
      <section id="tools" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold tracking-wide uppercase">Recommended Tools</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">Credit Builder Solutions</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              While you're learning, start building credit with these proven tools. 
              Each reports to all three major credit bureaus.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AffiliateCard
              id="creditBuilderAccount"
              icon="🏦"
              title="Credit Builder Accounts"
              price="From $15/month"
              description="Build credit history while saving money. Make on-time payments to boost your score."
              features={[
                'Reports to all 3 bureaus',
                'No hard credit check',
                'Build savings while you improve',
                'Cancel anytime'
              ]}
              cta="Get Started"
              badge="Most Popular"
            />
            <AffiliateCard
              id="rentReporting"
              icon="🏠"
              title="Rent Reporting"
              price="$6.95/month"
              description="Add up to 24 months of rent history to your credit report instantly."
              features={[
                'Backdate 2 years of rent',
                'Average +40 point boost',
                'Reports to all bureaus',
                'Simple verification'
              ]}
              cta="Add My Rent"
              badge="Fast Results"
            />
            <AffiliateCard
              id="securedCard"
              icon="💳"
              title="Secured Credit Cards"
              price="$200 deposit"
              description="Build credit with everyday purchases. $200 minimum, no annual fee."
              features={[
                'Reports to all 3 bureaus',
                'No annual fee',
                'Graduate to unsecured',
                'Fraud protection'
              ]}
              cta="Apply Now"
              badge="Best for Beginners"
            />
            <AffiliateCard
              id="subscriptionBuilder"
              icon="📱"
              title="Subscription Credit Builder"
              price="FREE"
              description="Build credit by paying for Netflix, Spotify, and other subscriptions."
              features={[
                'Completely free',
                'No credit check',
                'Use existing subscriptions',
                'Automatic payments'
              ]}
              cta="Start Free"
              badge="No Cost"
            />
            <AffiliateCard
              id="creditBuilderLoan"
              icon="💰"
              title="Credit Builder Loan"
              price="$10/month"
              description="24-month credit building plan. Payment history boosts your score."
              features={[
                '24-month term',
                'Reports monthly',
                'No hard inquiry',
                'Improve payment history'
              ]}
              cta="Start Building"
              badge="Best Value"
            />
            <AffiliateCard
              id="tradelines"
              icon="⚡"
              title="Tradeline Packages"
              price="From $299"
              description="Authorized user tradelines to instantly boost your credit age."
              features={[
                'Instant credit age boost',
                'High limit accounts',
                'Aged tradelines available',
                'Money-back guarantee'
              ]}
              cta="View Options"
              badge="Fastest Boost"
            />
          </div>
        </div>
      </section>

      {/* Credit Repair - Optional Upsell */}
      <section id="repair" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-yellow-400 font-semibold tracking-wide uppercase">Done For You</span>
              <h2 className="text-4xl font-bold mt-2 mb-4">
                Want Us to Handle Everything?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Our masterclass teaches you DIY, but if you're busy or want faster results, 
                our experts can handle your credit repair while you focus on life.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <span>Professional dispute handling</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <span>Custom dispute strategies</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <span>Progress tracking portal</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <span>90-day money-back guarantee (+75 pts)</span>
                </div>
              </div>
              <button 
                onClick={() => setShowCreditRepair(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold transition"
              >
                See Credit Repair Plans
              </button>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Compare Your Options</h3>
              <div className="space-y-6">
                <div className="border-b border-white/20 pb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-lg">DIY (Free Masterclass)</span>
                    <span className="text-green-400 font-bold">FREE</span>
                  </div>
                  <p className="text-slate-400 text-sm">Learn to do it yourself. Takes time but costs nothing.</p>
                </div>
                <div className="border-b border-white/20 pb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-lg">Essential Repair</span>
                    <span className="text-yellow-400 font-bold">$150 + $75/mo</span>
                  </div>
                  <p className="text-slate-400 text-sm">Basic dispute service for simple credit issues.</p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-lg">Aggressive Repair</span>
                    <span className="text-yellow-400 font-bold">$500 one-time</span>
                  </div>
                  <p className="text-slate-400 text-sm">Maximum effort disputes. 90-day guarantee.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Builder Section */}
      <section id="business" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold tracking-wide uppercase">For Entrepreneurs</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">Business Builder Program</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Ready to start a business? We help you build business credit that's separate from your personal credit.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-3xl mb-6">
                🏢
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Business Formation</h3>
              <p className="text-slate-600 mb-4">
                LLC formation, EIN acquisition, and business bank account setup.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• LLC or Corporation setup</li>
                <li>• EIN from IRS</li>
                <li>• Business bank account</li>
                <li>• DUNS number registration</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center text-3xl mb-6">
                📈
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Business Credit Building</h3>
              <p className="text-slate-600 mb-4">
                Establish 80+ Paydex score and access vendor credit lines.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Net-30 vendor accounts</li>
                <li>• Business credit cards</li>
                <li>• Trade line establishment</li>
                <li>• Dun & Bradstreet setup</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center text-3xl mb-6">
                💼
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Funding Access</h3>
              <p className="text-slate-600 mb-4">
                Qualify for business loans and lines of credit using your business credit.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Business line of credit</li>
                <li>• Equipment financing</li>
                <li>• SBA loan preparation</li>
                <li>• Investor presentation prep</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition"
            >
              Schedule Free Business Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Detailed Features Accordion */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Learn More About Our Services</h2>
            <p className="text-slate-600">Click each section to explore detailed features</p>
          </div>

          <FeatureAccordion
            title="🎯 Credit Builder Accounts"
            isOpen={activeSection === 'credit-builder'}
            onToggle={() => toggleSection('credit-builder')}
          >
            <div className="space-y-4">
              <p>Credit builder accounts are installment loans designed specifically to help you build credit. Here's how they work:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>The Loan:</strong> You "borrow" a set amount (usually $500-$2000), but the money is held in a locked savings account</li>
                <li><strong>Payments:</strong> You make monthly payments (reported to all 3 bureaus)</li>
                <li><strong>Completion:</strong> At the end of the term, you get the money back, plus you've built payment history</li>
                <li><strong>Cost:</strong> Usually $15-25/month depending on the plan</li>
              </ul>
              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <strong>Best for:</strong> People with no credit or looking to rebuild. Great for establishing payment history.
              </div>
            </div>
          </FeatureAccordion>

          <FeatureAccordion
            title="🏠 Rent Reporting"
            isOpen={activeSection === 'rent'}
            onToggle={() => toggleSection('rent')}
          >
            <div className="space-y-4">
              <p>Your rent payments can boost your credit score significantly. Most landlords don't report to credit bureaus, but we can change that.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Backdating:</strong> Add up to 24 months of past rent history instantly</li>
                <li><strong>Boost:</strong> Average score increase of 40+ points</li>
                <li><strong>Bureaus:</strong> Reports to TransUnion and Equifax (Experian coming soon)</li>
                <li><strong>Cost:</strong> $6.95/month or $65/year</li>
              </ul>
              <div className="bg-green-50 p-4 rounded-lg mt-4">
                <strong>Pro tip:</strong> This is one of the fastest ways to boost your score without taking on debt.
              </div>
            </div>
          </FeatureAccordion>

          <FeatureAccordion
            title="💳 Secured Credit Cards"
            isOpen={activeSection === 'secured'}
            onToggle={() => toggleSection('secured')}
          >
            <div className="space-y-4">
              <p>Secured cards are the easiest way to start building credit with revolving credit history.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Security Deposit:</strong> $200 minimum (refundable when you close or graduate)</li>
                <li><strong>Credit Limit:</strong> Usually equals your deposit</li>
                <li><strong>Reports:</strong> To all three major bureaus monthly</li>
                <li><strong>Graduation:</strong> Many cards upgrade you to unsecured after 6-12 months of on-time payments</li>
              </ul>
              <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                <strong>Key:</strong> Use it for small purchases (under 10% of limit) and pay in full each month.
              </div>
            </div>
          </FeatureAccordion>

          <FeatureAccordion
            title="🔧 Credit Repair Process"
            isOpen={activeSection === 'repair-process'}
            onToggle={() => toggleSection('repair-process')}
          >
            <div className="space-y-4">
              <p>Our professional credit repair service follows a proven multi-round dispute process:</p>
              <ol className="list-decimal pl-5 space-y-3">
                <li><strong>Analysis:</strong> We pull your credit reports from all 3 bureaus and identify negative items</li>
                <li><strong>Round 1:</strong> Initial dispute letters challenging inaccurate or unverifiable items</li>
                <li><strong>Round 2:</strong> If items remain, we escalate with method of verification requests</li>
                <li><strong>Round 3+:</strong> Continued pressure with bureau-specific tactics until deletion</li>
                <li><strong>Monitoring:</strong> You track progress in real-time through our client portal</li>
              </ol>
              <div className="bg-purple-50 p-4 rounded-lg mt-4">
                <strong>Timeline:</strong> Most clients see first deletions within 30-45 days. Full results in 3-6 months.
              </div>
            </div>
          </FeatureAccordion>

          <FeatureAccordion
            title="🏢 Business Credit Building"
            isOpen={activeSection === 'business-credit'}
            onToggle={() => toggleSection('business-credit')}
          >
            <div className="space-y-4">
              <p>Business credit is separate from personal credit and can unlock $50K-$100K+ in funding.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Tier 1:</strong> Vendor accounts (Net-30 terms) - Uline, Quill, Grainger</li>
                <li><strong>Tier 2:</strong> Store credit cards - Amazon Business, Lowe's, Home Depot</li>
                <li><strong>Tier 3:</strong> Fleet cards - Shell, Chevron, Fuelman</li>
                <li><strong>Tier 4:</strong> Cash credit cards - Visa, Mastercard in business name</li>
                <li><strong>Tier 5:</strong> Lines of credit and term loans</li>
              </ul>
              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <strong>Benefit:</strong> Business credit doesn't show on your personal credit report and typically has higher limits.
              </div>
            </div>
          </FeatureAccordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Credit?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our free 5-day masterclass and get the knowledge you need to take control of your financial future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowForm(true)}
              className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 text-lg px-8 py-4 rounded-xl font-bold transition"
            >
              Start Free Masterclass
            </button>
            <button 
              onClick={() => setShowCreditRepair(true)}
              className="bg-white/20 hover:bg-white/30 text-white text-lg px-8 py-4 rounded-xl font-semibold transition"
            >
              View Credit Repair Plans
            </button>
          </div>
          <p className="text-blue-200 text-sm mt-6">
            No credit card required. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <span className="text-xl font-bold text-white">CredX</span>
              </div>
              <p className="text-sm">
                Empowering you to take control of your credit and financial future.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#masterclass" className="hover:text-white">Free Masterclass</a></li>
                <li><a href="#tools" className="hover:text-white">Credit Tools</a></li>
                <li><a href="#repair" className="hover:text-white">Credit Repair</a></li>
                <li><a href="#business" className="hover:text-white">Business Builder</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-sm text-center">
            <p>© 2026 The Malloy Group Financial LLC (DBA: CredX). All rights reserved.</p>
            <p className="mt-2">
              1392 Madison Avenue, New York, NY 10029 | (866) 273-3963 | contact@credxme.com
            </p>
            <p className="mt-2 text-xs text-slate-500">
              NY DFS Registered | $25,000 Bond | 3-Day Cancellation Right
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showForm && <LeadForm onClose={() => setShowForm(false)} />}
      {showCreditRepair && <CreditRepairModal onClose={() => setShowCreditRepair(false)} />}
    </div>
  )
}

export default App
