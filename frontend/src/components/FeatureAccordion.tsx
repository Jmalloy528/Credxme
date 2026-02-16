interface FeatureAccordionProps {
  title: string
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}

export default function FeatureAccordion({ title, children, isOpen, onToggle }: FeatureAccordionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-slate-50 transition"
      >
        <span className="font-semibold text-lg text-slate-900">{title}</span>
        <span className={`text-2xl transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ⌄
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-slate-600">
          {children}
        </div>
      )}
    </div>
  )
}
