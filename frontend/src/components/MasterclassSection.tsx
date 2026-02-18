import { useState } from 'react'

interface DayContent {
  day: number
  title: string
  description: string
  whatYoullLearn: string[]
  actionItems: string[]
  videoLength: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
}

const masterclassContent: DayContent[] = [
  {
    day: 1,
    title: 'Understanding Your Credit Report',
    description: 'Before you can fix your credit, you need to understand what\'s actually on your report. Today we\'ll decode the mystery and show you exactly what lenders see.',
    whatYoullLearn: [
      'How to get your REAL credit reports (not Credit Karma estimates)',
      'The difference between FICO and VantageScore (and which matters)',
      'How to read each section of your credit report',
      'What each negative item means and how long it stays',
      'Which items are hurting you most (hint: it\'s not what you think)'
    ],
    actionItems: [
      'Pull your credit reports from all 3 bureaus',
      'Create a master spreadsheet of all negative items',
      'Identify any errors or inaccuracies',
      'Calculate your current credit utilization'
    ],
    videoLength: '18 minutes',
    difficulty: 'Beginner'
  },
  {
    day: 2,
    title: 'Dispute Strategies That Actually Work',
    description: 'Stop sending generic dispute letters that get rejected. Learn the specific strategies that professional credit repair companies use to get deletions.',
    whatYoullLearn: [
      'The "609 Dispute" method and when to use it',
      'Method of Verification (MOV) letters that force action',
      'How to dispute based on inaccuracies vs. unverifiable items',
      'The 1-2 punch technique for stubborn accounts',
      'When to escalate to the CFPB and state attorneys general'
    ],
    actionItems: [
      'Write your first round of dispute letters',
      'Send certified mail with return receipt requested',
      'Set up tracking system for response deadlines',
      'Prepare Round 2 letters for non-responses'
    ],
    videoLength: '24 minutes',
    difficulty: 'Intermediate'
  },
  {
    day: 3,
    title: 'Building Positive Credit History',
    description: 'Removing negatives is only half the battle. Today we focus on adding positive accounts that boost your score fast.',
    whatYoullLearn: [
      'Credit builder accounts that report to all 3 bureaus',
      'Authorized user tradelines (and the risks)',
      'Rent reporting services that add 24 months of history',
      'Secured credit cards that graduate to unsecured',
      'How to optimize credit utilization across all cards'
    ],
    actionItems: [
      'Open at least one credit builder account',
      'Set up automatic payments (never miss again)',
      'Add rent reporting if you\'re a renter',
      'Calculate your target utilization for each card'
    ],
    videoLength: '21 minutes',
    difficulty: 'Beginner'
  },
  {
    day: 4,
    title: 'Advanced Tactics for Deletions',
    description: 'For stubborn negative items that won\'t budge, we bring out the heavy artillery. These tactics require patience but deliver results.',
    whatYoullLearn: [
      'Pay-for-delete negotiations (and how to document them)',
      'Goodwill letters for legitimate late payments',
      'Student loan rehabilitation vs. consolidation',
      'Medical debt strategies (new 2023 rules)',
      'How to handle charge-offs vs. collections'
    ],
    actionItems: [
      'Draft pay-for-delete offers for collections',
      'Send goodwill letters to original creditors',
      'Research statute of limitations in your state',
      'Prioritize which items to tackle first'
    ],
    videoLength: '28 minutes',
    difficulty: 'Advanced'
  },
  {
    day: 5,
    title: 'Maintaining Your New Score',
    description: 'Getting a high score is one thing—keeping it is another. Today we build systems to protect your credit for life.',
    whatYoullLearn: [
      'The 6 habits of people with 800+ credit scores',
      'How to set up credit monitoring alerts',
      'When to apply for new credit (and when to wait)',
      'How to remove hard inquiries',
      'Building a 3-6-12 month action plan'
    ],
    actionItems: [
      'Set up free credit monitoring',
      'Create calendar reminders for key dates',
      'Plan your next 3 credit applications',
      'Join the CredX community for ongoing support'
    ],
    videoLength: '19 minutes',
    difficulty: 'Beginner'
  }
]

export default function MasterclassSection() {
  const [activeDay, setActiveDay] = useState(1)
  const currentDay = masterclassContent.find(d => d.day === activeDay) || masterclassContent[0]

  return (
    <section id="masterclass-detail" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold tracking-wide uppercase">Free 5-Day Program</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">The Credit Masterclass Curriculum</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Each day builds on the last. By Day 5, you'll have a complete credit repair system 
            and a clear path to 700+.
          </p>
        </div>

        {/* Progress Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {masterclassContent.map((day) => (
            <button
              key={day.day}
              onClick={() => setActiveDay(day.day)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeDay === day.day
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Day {day.day}
            </button>
          ))}
        </div>

        {/* Day Content Card */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 lg:p-12 shadow-xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Day Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                  {currentDay.day}
                </div>
                <div>
                  <div className="text-sm text-blue-600 font-semibold">DAY {currentDay.day} OF 5</div>
                  <div className="text-sm text-slate-500">{currentDay.videoLength}</div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {currentDay.title}
              </h3>

              <p className="text-slate-600 mb-6">
                {currentDay.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-2xl">📹</span>
                  <span className="text-slate-600">{currentDay.videoLength} video lesson</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-2xl">📝</span>
                  <span className="text-slate-600">Downloadable worksheets</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-2xl">✅</span>
                  <span className="text-slate-600">{currentDay.actionItems.length} action items</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-2xl">🎯</span>
                  <span className={`font-medium ${
                    currentDay.difficulty === 'Beginner' ? 'text-green-600' :
                    currentDay.difficulty === 'Intermediate' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {currentDay.difficulty} level
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Column - What You'll Learn */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🧠</span>
                  What You'll Learn
                </h4>
                <ul className="space-y-3">
                  {currentDay.whatYoullLearn.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-blue-500 mt-1">✓</span>
                      <span className="text-slate-600 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column - Action Items */}
            <div className="lg:col-span-1">
              <div className="bg-blue-600 rounded-2xl p-6 text-white h-full">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  Today's Action Items
                </h4>
                <ul className="space-y-3">
                  {currentDay.actionItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-blue-100 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="text-sm text-blue-200 mb-2">
                    💡 Pro Tip: Complete these actions before moving to Day {currentDay.day + 1}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-8 border-t border-slate-200">
            <button
              onClick={() => setActiveDay(Math.max(1, activeDay - 1))}
              disabled={activeDay === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 hover:text-slate-900"
            >
              ← Previous Day
            </button>

            <div className="text-center">
              <div className="text-sm text-slate-500">
                {activeDay} of 5 days
              </div>
              <div className="w-32 h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${(activeDay / 5) * 100}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setActiveDay(Math.min(5, activeDay + 1))}
              disabled={activeDay === 5}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-medium transition"
            >
              Next Day →
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-slate-600 mb-6">
            Ready to start your credit transformation?
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-xl font-bold transition shadow-lg">
            Enroll Free Now →
          </button>
          <p className="text-sm text-slate-500 mt-4">
            Join 12,000+ students. No credit card required.
          </p>
        </div>
      </div>
    </section>
  )
}
