interface CreditRepairModalProps {
  onClose: () => void
}

export default function CreditRepairModal({ onClose }: CreditRepairModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Credit Repair Plans</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <p className="text-slate-600">
              Professional credit repair with our 90-day money-back guarantee. 
              If your score doesn't increase by at least 75 points, we'll refund every penny.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* DIY */}
            <div className="border-2 border-slate-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">DIY Masterclass</h3>
              <div className="text-4xl font-bold text-green-600 mb-4">FREE</div>
              <p className="text-slate-600 text-sm mb-6">Learn to repair your own credit with our proven 5-day system.</p>
              
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 5-day email course
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Dispute templates
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Video training
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Community access
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <span>×</span> No done-for-you service
                </li>
              </ul>

              <button 
                onClick={onClose}
                className="w-full border-2 border-slate-900 text-slate-900 py-3 rounded-lg font-medium hover:bg-slate-50 transition"
              >
                Get Free Access
              </button>
            </div>

            {/* Essential */}
            <div className="border-2 border-blue-200 rounded-2xl p-6 relative">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Essential Repair</h3>
              <div className="text-4xl font-bold text-blue-600 mb-1">$150</div>
              <div className="text-slate-500 text-sm mb-4">+ $75/month</div>
              <p className="text-slate-600 text-sm mb-6">Perfect for light credit cleanup with a few negative items.</p>
              
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Full credit analysis
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Round 1 disputes
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Client portal access
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Monthly updates
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Email support
                </li>
              </ul>

              <button 
                onClick={onClose}
                className="w-full bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300 transition"
              >
                Choose Essential
              </button>
            </div>

            {/* Aggressive */}
            <div className="border-2 border-yellow-400 rounded-2xl p-6 relative bg-gradient-to-b from-yellow-50 to-white">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full">
                MOST POPULAR
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">Aggressive Repair</h3>
              <div className="text-4xl font-bold text-blue-600 mb-1">$500</div>
              <div className="text-green-600 text-sm font-semibold mb-4">90-Day Guarantee (+75 pts)</div>
              <p className="text-slate-600 text-sm mb-6">Maximum effort disputes for serious credit issues.</p>
              
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Everything in Essential
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Multiple dispute rounds
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Priority processing
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Phone consultations
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 90-day money-back guarantee
                </li>
              </ul>

              <button 
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
              >
                Choose Aggressive
              </button>
            </div>
          </div>

          <div className="mt-8 bg-slate-50 rounded-xl p-6">
            <h4 className="font-bold text-slate-900 mb-4">📋 What's Included in All Paid Plans:</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Credit report analysis from all 3 bureaus
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Custom dispute letter generation
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 24/7 client portal access
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Progress tracking dashboard
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Monthly credit monitoring
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Dispute status updates
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> Identity theft protection tips
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 3-day cancellation right
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            The Malloy Group Financial LLC (DBA: CredX) | NY DFS Registered | $25,000 Bond | 
            You have the right to cancel within 3 business days. No work performed before payment.
          </div>
        </div>
      </div>
    </div>
  )
}
