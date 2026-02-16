interface AffiliateCardProps {
  icon: string
  title: string
  price: string
  description: string
  features: string[]
  cta: string
  badge?: string
}

export default function AffiliateCard({ icon, title, price, description, features, cta, badge }: AffiliateCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
      {badge && (
        <div className="bg-blue-600 text-white text-xs font-bold px-4 py-1 text-center">
          {badge}
        </div>
      )}
      <div className="p-6">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <div className="text-blue-600 font-bold text-lg mb-3">{price}</div>
        <p className="text-slate-600 text-sm mb-4">{description}</p>
        
        <ul className="space-y-2 mb-6">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
              <span className="text-green-500">✓</span>
              {feature}
            </li>
          ))}
        </ul>
        
        <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-medium transition">
          {cta}
        </button>
      </div>
    </div>
  )
}
