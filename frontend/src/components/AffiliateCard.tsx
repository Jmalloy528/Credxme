import { AFFILIATE_LINKS } from '../config/affiliates'

interface AffiliateCardProps {
  id: keyof typeof AFFILIATE_LINKS
  icon: string
  title: string
  price: string
  description: string
  features: string[]
  cta: string
  badge?: string
}

export default function AffiliateCard({ id, icon, title, price, description, features, cta, badge }: AffiliateCardProps) {
  const affiliate = AFFILIATE_LINKS[id]
  
  const handleClick = () => {
    // Track click (you can add analytics here)
    console.log(`Affiliate click: ${affiliate.name}`)
    window.open(affiliate.url, '_blank')
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition flex flex-col">
      {badge && (
        <div className="bg-blue-600 text-white text-xs font-bold px-4 py-1 text-center">
          {badge}
        </div>
      )}
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <div className="text-blue-600 font-bold text-lg mb-3">{price}</div>
        <p className="text-slate-600 text-sm mb-4">{description}</p>
        
        <ul className="space-y-2 mb-6 flex-1">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
              <span className="text-green-500">✓</span>
              {feature}
            </li>
          ))}
        </ul>
        
        <button 
          onClick={handleClick}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-medium transition"
        >
          {cta}
        </button>
        
        <p className="text-xs text-slate-400 text-center mt-2">
          via {affiliate.name}
        </p>
      </div>
    </div>
  )
}
