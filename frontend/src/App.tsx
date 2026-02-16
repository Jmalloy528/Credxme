import { useState } from 'react'
import './App.css'
import LeadForm from './components/LeadForm'

function App() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-white">CredX</div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Fix Your Credit.<br />
          <span className="text-blue-400">Reclaim Your Future.</span>
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Professional credit repair services backed by results. 
          90-day money-back guarantee on our Aggressive Repair plan.
        </p>
        
        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 text-slate-400 text-sm">
          <span className="flex items-center gap-2">
            <span className="text-green-400">✓</span> NY DFS Registered
          </span>
          <span className="flex items-center gap-2">
            <span className="text-green-400">✓</span> $25K Bond
          </span>
          <span className="flex items-center gap-2">
            <span className="text-green-400">✓</span> 3-Day Cancellation
          </span>
        </div>

        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-4 rounded-xl font-semibold transition transform hover:scale-105"
        >
          Start Your Free Consultation
        </button>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Choose Your Plan</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Essential */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-2">Essential Repair</h3>
            <p className="text-slate-400 text-sm mb-6">Perfect for light credit cleanup</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$150</span>
              <span className="text-slate-400"> setup</span>
            </div>
            <ul className="text-slate-300 space-y-3 mb-8 text-sm">
              <li>• Full credit analysis</li>
              <li>• Round 1 dispute letters</li>
              <li>• Client portal access</li>
              <li>• Monthly progress updates</li>
            </ul>
            <div className="text-center text-slate-400 text-sm mb-6">+$75/month</div>
            <button 
              onClick={() => setShowForm(true)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition"
            >
              Get Started
            </button>
          </div>

          {/* Aggressive - Featured */}
          <div className="bg-blue-500/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-blue-400 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Aggressive Repair</h3>
            <p className="text-slate-400 text-sm mb-6">Maximum results, faster</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$500</span>
              <span className="text-slate-400"> setup</span>
            </div>
            <ul className="text-slate-300 space-y-3 mb-8 text-sm">
              <li>• Everything in Essential</li>
              <li>• Multiple dispute rounds</li>
              <li>• Priority processing</li>
              <li>• 90-day guarantee (+75 pts)</li>
            </ul>
            <div className="text-center text-blue-300 text-sm mb-6">Money-back guarantee</div>
            <button 
              onClick={() => setShowForm(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition"
            >
              Get Started
            </button>
          </div>

          {/* Family */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-2">Couples/Family</h3>
            <p className="text-slate-400 text-sm mb-6">Save together</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$300</span>
              <span className="text-slate-400"> setup</span>
            </div>
            <ul className="text-slate-300 space-y-3 mb-8 text-sm">
              <li>• Up to 4 family members</li>
              <li>• Individual credit analysis</li>
              <li>• Coordinated disputes</li>
              <li>• Shared portal dashboard</li>
            </ul>
            <div className="text-center text-slate-400 text-sm mb-6">+$95/month</div>
            <button 
              onClick={() => setShowForm(true)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Footer */}
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <p className="text-slate-400 text-sm">
          The Malloy Group Financial LLC (DBA: CredX) is registered with the New York Department of Financial Services. 
          You have the right to cancel within 3 business days. No work is performed before payment. 
          Results vary and are not guaranteed except where explicitly stated.
        </p>
        <div className="mt-4 text-slate-500 text-xs">
          1392 Madison Avenue, New York, NY 10029 | (866) 273-3963 | contact@credxme.com
        </div>
      </div>

      {/* Lead Form Modal */}
      {showForm && <LeadForm onClose={() => setShowForm(false)} />}
    </div>
  )
}

export default App
