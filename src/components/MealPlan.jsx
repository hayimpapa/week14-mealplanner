import { useState } from 'react'

const SLOTS = [
  { key: 'breakfast', label: 'Breakfast', icon: '🌅', color: 'bg-cream-100 text-amber-800' },
  { key: 'lunch', label: 'Lunch', icon: '🥗', color: 'bg-sage-50 text-sage-800' },
  { key: 'dinner', label: 'Dinner', icon: '🍽️', color: 'bg-orange-50 text-tangerine-600' }
]

function MealCard({ slot, meal }) {
  const [open, setOpen] = useState(false)
  if (!meal) return null
  return (
    <div className="rounded-xl border border-sage-100 bg-white p-4 hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${slot.color} font-medium`}>
            {slot.icon} {slot.label}
          </span>
          {meal.prepTime && (
            <span className="text-xs text-sage-500">⏱ {meal.prepTime}</span>
          )}
        </div>
      </div>
      <h4 className="font-display text-lg font-semibold text-sage-900 leading-tight">
        {meal.name}
      </h4>
      {meal.description && (
        <p className="mt-1 text-sm text-sage-600">{meal.description}</p>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-3 text-sm text-sage-600 hover:text-sage-800 font-medium"
      >
        {open ? '− Hide recipe' : '+ Show recipe'}
      </button>
      {open && (
        <div className="mt-3 grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-semibold text-sage-800 mb-1">Ingredients</div>
            <ul className="space-y-1 text-sage-700">
              {meal.ingredients?.map((i, idx) => (
                <li key={idx}>• {i}</li>
              ))}
            </ul>
          </div>
          {meal.method && meal.method.length > 0 && (
            <div>
              <div className="font-semibold text-sage-800 mb-1">Method</div>
              <ol className="space-y-1 text-sage-700 list-decimal list-inside">
                {meal.method.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function MealPlan({ plan }) {
  return (
    <div className="space-y-4">
      {plan.meals.map((day) => (
        <div key={day.day} className="card p-6">
          <h3 className="text-2xl font-display font-semibold text-sage-800 mb-4">
            {day.day}
          </h3>
          <div className="grid lg:grid-cols-3 gap-3">
            {SLOTS.map((slot) => (
              <MealCard key={slot.key} slot={slot} meal={day[slot.key]} />
            ))}
          </div>
          {day.snacks && day.snacks.length > 0 && (
            <div className="mt-4 pt-4 border-t border-sage-100">
              <div className="text-xs uppercase tracking-wide text-sage-500 font-semibold mb-2">
                Snacks
              </div>
              <div className="flex flex-wrap gap-2">
                {day.snacks.map((s, i) => (
                  <span
                    key={i}
                    title={s.description || ''}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-cream-100 text-amber-800 text-sm"
                  >
                    🍎 {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
