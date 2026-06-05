const STEPS = [
  'Considering your dietary needs…',
  'Browsing seasonal produce…',
  'Balancing variety across the week…',
  'Writing recipe cards…',
  'Compiling your shopping list…'
]

export default function LoadingState() {
  return (
    <div className="card p-12 text-center">
      <div className="text-5xl mb-4 animate-bounce">🥘</div>
      <h2 className="text-2xl font-display font-semibold text-sage-800">
        Planning your week…
      </h2>
      <p className="text-sage-600 mt-2">This usually takes 20–40 seconds.</p>
      <ul className="mt-6 max-w-sm mx-auto space-y-2 text-left text-sm text-sage-700">
        {STEPS.map((s, i) => (
          <li key={i} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full bg-sage-400 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
            {s}
          </li>
        ))}
      </ul>
    </div>
  )
}
