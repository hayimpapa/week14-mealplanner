import { useEffect, useState } from 'react'

const DIETS = ['Omnivore', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo', 'Gluten-Free']
const ALLERGENS = ['Nuts', 'Dairy', 'Shellfish', 'Eggs', 'Soy', 'Sesame', 'Gluten', 'Fish']
const CUISINES = [
  'Mediterranean', 'Italian', 'Asian', 'Mexican',
  'Middle Eastern', 'Indian', 'American', 'French', 'Japanese', 'Thai'
]

const TIME_OPTIONS = [
  { value: 'quick', label: 'Quick', sub: 'Under 30 min' },
  { value: 'medium', label: 'Medium', sub: '30–60 min' },
  { value: 'flexible', label: 'Flexible', sub: 'No limit' }
]

const DEFAULT_PREFS = {
  diets: ['Omnivore'],
  allergies: [],
  allergyOther: '',
  cuisines: ['Mediterranean'],
  cookingTime: 'medium',
  servings: 4,
  notes: ''
}

export default function PlannerForm({ onSubmit, loading }) {
  const [apiKey, setApiKey] = useState('')
  const [prefs, setPrefs] = useState(DEFAULT_PREFS)
  const [showKey, setShowKey] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('anthropic_api_key')
    if (saved) setApiKey(saved)
    const savedPrefs = localStorage.getItem('meal_planner_prefs')
    if (savedPrefs) {
      try { setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(savedPrefs) }) } catch {}
    }
  }, [])

  const toggle = (field, value) => {
    setPrefs((p) => ({
      ...p,
      [field]: p[field].includes(value)
        ? p[field].filter((v) => v !== value)
        : [...p[field], value]
    }))
  }

  const submit = (e) => {
    e.preventDefault()
    localStorage.setItem('anthropic_api_key', apiKey)
    localStorage.setItem('meal_planner_prefs', JSON.stringify(prefs))
    onSubmit({ apiKey, prefs })
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* API key */}
      <div className="card p-6">
        <label className="label" htmlFor="apikey">Anthropic API key</label>
        <div className="flex gap-2">
          <input
            id="apikey"
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-..."
            className="input flex-1 font-mono text-sm"
            autoComplete="off"
            required
          />
          <button
            type="button"
            className="btn-secondary !py-2 !px-4 text-sm"
            onClick={() => setShowKey((s) => !s)}
          >
            {showKey ? 'Hide' : 'Show'}
          </button>
        </div>
        <p className="mt-2 text-xs text-sage-600">
          Stored only in your browser's localStorage. Get one at{' '}
          <a className="underline" href="https://console.anthropic.com/" target="_blank" rel="noreferrer">
            console.anthropic.com
          </a>.
        </p>
      </div>

      {/* Diet */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-sage-800 mb-3">Dietary type</h3>
        <div className="flex flex-wrap gap-2">
          {DIETS.map((d) => (
            <span
              key={d}
              onClick={() => toggle('diets', d)}
              className={`chip ${prefs.diets.includes(d) ? 'chip-on' : 'chip-off'}`}
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Allergens */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-sage-800 mb-1">Allergens to avoid</h3>
        <p className="text-sm text-sage-600 mb-3">We'll keep these out of every meal.</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {ALLERGENS.map((a) => (
            <span
              key={a}
              onClick={() => toggle('allergies', a)}
              className={`chip ${prefs.allergies.includes(a) ? 'chip-on' : 'chip-off'}`}
            >
              {a}
            </span>
          ))}
        </div>
        <input
          className="input"
          placeholder="Other allergies (comma separated)"
          value={prefs.allergyOther}
          onChange={(e) => setPrefs({ ...prefs, allergyOther: e.target.value })}
        />
      </div>

      {/* Cuisines */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-sage-800 mb-1">Favorite cuisines</h3>
        <p className="text-sm text-sage-600 mb-3">Pick a few — we'll keep the week varied.</p>
        <div className="flex flex-wrap gap-2">
          {CUISINES.map((c) => (
            <span
              key={c}
              onClick={() => toggle('cuisines', c)}
              className={`chip ${prefs.cuisines.includes(c) ? 'chip-on' : 'chip-off'}`}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Time + servings */}
      <div className="card p-6 grid sm:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-sage-800 mb-3">Cooking time</h3>
          <div className="grid grid-cols-3 gap-2">
            {TIME_OPTIONS.map((t) => {
              const active = prefs.cookingTime === t.value
              return (
                <button
                  type="button"
                  key={t.value}
                  onClick={() => setPrefs({ ...prefs, cookingTime: t.value })}
                  className={`rounded-xl border p-3 text-left transition ${
                    active
                      ? 'border-sage-600 bg-sage-50'
                      : 'border-sage-200 hover:bg-cream-100'
                  }`}
                >
                  <div className="font-semibold text-sage-800">{t.label}</div>
                  <div className="text-xs text-sage-600">{t.sub}</div>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-sage-800 mb-3">Servings per meal</h3>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPrefs({ ...prefs, servings: Math.max(1, prefs.servings - 1) })}
              className="h-10 w-10 rounded-full bg-cream-100 hover:bg-cream-200 text-sage-800 font-bold"
            >−</button>
            <div className="text-3xl font-display w-12 text-center">{prefs.servings}</div>
            <button
              type="button"
              onClick={() => setPrefs({ ...prefs, servings: Math.min(12, prefs.servings + 1) })}
              className="h-10 w-10 rounded-full bg-cream-100 hover:bg-cream-200 text-sage-800 font-bold"
            >+</button>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-sage-800 mb-1">Special notes</h3>
        <p className="text-sm text-sage-600 mb-3">
          e.g. "budget-friendly", "high protein", "no spicy food", "kid friendly"
        </p>
        <textarea
          className="input min-h-[80px]"
          value={prefs.notes}
          onChange={(e) => setPrefs({ ...prefs, notes: e.target.value })}
          placeholder="Anything else we should know?"
        />
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="btn-primary text-lg">
          {loading ? 'Planning your week…' : 'Generate meal plan →'}
        </button>
      </div>
    </form>
  )
}
