import Anthropic from '@anthropic-ai/sdk'

const MODEL = 'claude-sonnet-4-6'

const SYSTEM_PROMPT = `You are a professional meal planner and nutritionist with deep culinary expertise.
You create varied, seasonal, realistic 7-day meal plans that home cooks will actually make.

Hard rules:
- Strictly respect dietary requirements and excluded allergens. Never include forbidden ingredients
  (including in hidden places like sauces or stocks).
- Bias toward the user's preferred cuisines but allow gentle variety across the week so no two days feel the same.
- Keep each meal within the requested cooking time budget.
- Portion ingredient quantities for the requested number of servings.
- Snacks are simple (no recipe needed) — 1 or 2 per day.

Output rules:
- Return ONLY valid JSON that matches the schema. No prose, no markdown fences.
- Every meal must include "name", "description" (one short sentence), "prepTime"
  (e.g. "25 min"), "ingredients" (array of short strings with quantity, e.g. "2 cups spinach"),
  and "method" (array of 3-5 short imperative steps).
- Snacks omit "method" and "prepTime".
- The shoppingList must aggregate ALL ingredients used across the week (combining duplicates with
  summed quantities) and group them by grocery section.
- Categories to use for shoppingList: "Produce", "Proteins", "Dairy & Eggs", "Pantry",
  "Frozen", "Bakery", "Other". Omit any category that is empty.`

const SCHEMA_HINT = `{
  "meals": [
    {
      "day": "Monday",
      "breakfast": { "name": "", "description": "", "prepTime": "", "ingredients": [], "method": [] },
      "lunch":     { "name": "", "description": "", "prepTime": "", "ingredients": [], "method": [] },
      "dinner":    { "name": "", "description": "", "prepTime": "", "ingredients": [], "method": [] },
      "snacks":    [ { "name": "", "description": "", "ingredients": [] } ]
    }
  ],
  "shoppingList": [
    { "category": "Produce", "items": [ { "name": "", "quantity": "" } ] }
  ]
}`

function buildUserPrompt(prefs) {
  const {
    diets, allergies, allergyOther, cuisines, cookingTime,
    servings, notes
  } = prefs

  const allAllergies = [...allergies, ...(allergyOther ? [allergyOther] : [])]

  const cookingTimeLabel = {
    quick: 'no more than 30 minutes',
    medium: 'between 30 and 60 minutes',
    flexible: 'no strict time limit (keep most meals under 60 minutes though)'
  }[cookingTime] || 'no strict time limit'

  return `Generate a 7-day meal plan (Monday through Sunday).

Dietary requirements: ${diets.length ? diets.join(', ') : 'No specific dietary type'}
Allergens to AVOID entirely: ${allAllergies.length ? allAllergies.join(', ') : 'none'}
Preferred cuisines: ${cuisines.length ? cuisines.join(', ') : 'any cuisine, keep it varied'}
Per-meal cooking time: ${cookingTimeLabel}
Servings per meal: ${servings}
Additional notes from the user: ${notes || 'none'}

Use this exact JSON schema:
${SCHEMA_HINT}

Return ONLY the JSON object, nothing else.`
}

export async function generateMealPlan(apiKey, prefs) {
  if (!apiKey) throw new Error('Anthropic API key is required.')

  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true
  })

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(prefs) }]
  })

  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim()

  if (response.stop_reason === 'max_tokens') {
    throw new Error(
      'Claude ran out of output tokens before finishing the plan. ' +
      'Try fewer cuisines or shorter notes, then regenerate.'
    )
  }

  const parsed = extractJson(text)
  validatePlan(parsed)
  return parsed
}

function extractJson(text) {
  // strip ```json fences if the model adds them
  const cleaned = text.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    const first = cleaned.indexOf('{')
    const last = cleaned.lastIndexOf('}')
    if (first !== -1 && last !== -1) {
      try {
        return JSON.parse(cleaned.slice(first, last + 1))
      } catch {
        // fall through to friendlier error
      }
    }
    throw new Error(
      'Could not parse the meal plan Claude returned. The response may have ' +
      'been cut off. Please regenerate.'
    )
  }
}

function validatePlan(plan) {
  if (!plan || !Array.isArray(plan.meals) || !Array.isArray(plan.shoppingList)) {
    throw new Error('Meal plan JSON is missing required fields.')
  }
  if (plan.meals.length < 1) {
    throw new Error('Meal plan has no days.')
  }
}
