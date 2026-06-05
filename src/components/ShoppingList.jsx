import { useMemo, useState } from 'react'

const CATEGORY_ICONS = {
  Produce: '🥬',
  Proteins: '🍗',
  'Dairy & Eggs': '🥛',
  Dairy: '🥛',
  Pantry: '🌾',
  Frozen: '🧊',
  Bakery: '🥖',
  Other: '🧂'
}

export default function ShoppingList({ plan }) {
  const totalItems = useMemo(
    () => plan.shoppingList.reduce((n, s) => n + s.items.length, 0),
    [plan]
  )
  const [checked, setChecked] = useState({})
  const doneCount = Object.values(checked).filter(Boolean).length

  const toggle = (key) => setChecked((c) => ({ ...c, [key]: !c[key] }))

  return (
    <div className="card p-6">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h3 className="text-2xl font-display font-semibold text-sage-800">Shopping list</h3>
          <p className="text-sm text-sage-600">
            {totalItems} items • {doneCount} checked off
          </p>
        </div>
        <div className="h-2 w-40 rounded-full bg-cream-100 overflow-hidden">
          <div
            className="h-full bg-sage-500 transition-all"
            style={{ width: `${totalItems ? (doneCount / totalItems) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plan.shoppingList.map((section) => (
          <div key={section.category}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{CATEGORY_ICONS[section.category] || '🛒'}</span>
              <h4 className="font-display text-lg font-semibold text-sage-800">
                {section.category}
              </h4>
            </div>
            <ul className="space-y-1.5">
              {section.items.map((item, idx) => {
                const key = `${section.category}-${idx}`
                const isChecked = !!checked[key]
                return (
                  <li
                    key={key}
                    onClick={() => toggle(key)}
                    className="flex items-start gap-2 cursor-pointer group py-1"
                  >
                    <input
                      type="checkbox"
                      readOnly
                      checked={isChecked}
                      className="shop-check mt-0.5"
                      tabIndex={-1}
                    />
                    <span
                      className={`text-sm transition ${
                        isChecked
                          ? 'line-through text-sage-400'
                          : 'text-sage-800 group-hover:text-sage-900'
                      }`}
                    >
                      <span className="font-medium">{item.name}</span>
                      {item.quantity && (
                        <span className="text-sage-500"> — {item.quantity}</span>
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
