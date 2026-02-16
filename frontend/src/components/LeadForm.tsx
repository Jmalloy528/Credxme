import { useState } from 'react'

interface LeadFormProps {
  onClose: () => void
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  creditGoal: string
}

export default function LeadForm({ onClose }: LeadFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    creditGoal: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'masterclass',
          type: 'free_course'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit. Please try again.')
      }

      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">You're In! Check Your Email</h2>
          <p className="text-slate-600 mb-6">
            Welcome to the CredX 5-Day Credit Masterclass! Your first lesson is on its way to your inbox.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-semibold text-blue-900 mb-2">What's Next:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>📧 Check your email (and spam folder)</li>
              <li>📱 Join our private community (link in email)</li>
              <li>🎯 Download your credit worksheet</li>
              <li>📅 Day 1 lesson arrives within 10 minutes</li>
            </ul>
          </div>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Got It! Can't Wait!
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl leading-none"
        >
          ×
        </button>

        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎓</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Join the Free 5-Day Masterclass</h2>
          <p className="text-slate-600 text-sm">Learn the exact strategies used by credit experts — delivered free to your inbox.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="John"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="creditGoal" className="block text-sm font-medium text-slate-700 mb-1">
              What's Your Biggest Credit Goal?
            </label>
            <select
              id="creditGoal"
              name="creditGoal"
              value={formData.creditGoal}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="">Select your goal...</option>
              <option value="buy-home">Buy a Home 🏠</option>
              <option value="buy-car">Buy a Car 🚗</option>
              <option value="lower-rates">Get Lower Interest Rates 📉</option>
              <option value="remove-negative">Remove Negative Items 🗑️</option>
              <option value="start-business">Start a Business 💼</option>
              <option value="general-improve">Just Improve My Score 📈</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⟳</span>
                Enrolling...
              </>
            ) : (
              'Start My Free Masterclass →'
            )}
          </button>

          <div className="text-center space-y-2">
            <p className="text-xs text-slate-500">
              🔒 We respect your privacy. Unsubscribe anytime.
            </p>
            <p className="text-xs text-slate-400">
              Join 12,000+ students already taking control of their credit.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
