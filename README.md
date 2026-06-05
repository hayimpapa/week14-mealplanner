# Weekly Meal Planner

A beautiful React app that generates personalized 7-day meal plans using Claude.

## Features

- Dietary type, allergies, cuisine preference, cook time, and servings form
- Claude-generated 7-day meal plan (breakfast, lunch, dinner + snacks)
- Expandable recipe cards for every meal
- Auto-generated shopping list grouped by grocery section with checkboxes
- Printable PDF export (meal plan + shopping list + recipe cards)
- Regenerate button to try different options

## Stack

- React + Vite
- Tailwind CSS
- `@anthropic-ai/sdk` (browser, with `dangerouslyAllowBrowser`)
- `jspdf` for PDF export

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`). Paste your
Anthropic API key into the form (stored in `localStorage`).

## Build

```bash
npm run build
npm run preview
```
