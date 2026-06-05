import jsPDF from 'jspdf'

const MARGIN = 48
const LINE = 14

export function exportPlanToPdf(plan, prefs) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const contentW = pageW - MARGIN * 2

  let y = MARGIN

  const ensureSpace = (needed) => {
    if (y + needed > pageH - MARGIN) {
      doc.addPage()
      y = MARGIN
    }
  }

  const text = (str, opts = {}) => {
    const {
      size = 11, style = 'normal', color = [40, 56, 33], maxWidth = contentW,
      gapAfter = 4
    } = opts
    doc.setFont('helvetica', style)
    doc.setFontSize(size)
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(str, maxWidth)
    ensureSpace(lines.length * (size + 2))
    doc.text(lines, MARGIN, y)
    y += lines.length * (size + 2) + gapAfter
  }

  const hr = () => {
    ensureSpace(10)
    doc.setDrawColor(168, 197, 151)
    doc.setLineWidth(0.5)
    doc.line(MARGIN, y, pageW - MARGIN, y)
    y += 12
  }

  const sectionTitle = (title) => {
    ensureSpace(40)
    text(title, { size: 20, style: 'bold', color: [71, 106, 57], gapAfter: 8 })
    hr()
  }

  // -------- HEADER --------
  text('Your Weekly Meal Plan', { size: 26, style: 'bold', color: [71, 106, 57], gapAfter: 6 })
  text(new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
    { size: 10, color: [120, 120, 120], gapAfter: 10 })

  // Dietary summary
  const summaryParts = []
  if (prefs.diets.length) summaryParts.push(`Diet: ${prefs.diets.join(', ')}`)
  const allergens = [...prefs.allergies, ...(prefs.allergyOther ? [prefs.allergyOther] : [])]
  if (allergens.length) summaryParts.push(`Avoid: ${allergens.join(', ')}`)
  if (prefs.cuisines.length) summaryParts.push(`Cuisines: ${prefs.cuisines.join(', ')}`)
  summaryParts.push(`Servings: ${prefs.servings}`)
  summaryParts.push(`Cook time: ${prefs.cookingTime}`)
  if (prefs.notes) summaryParts.push(`Notes: ${prefs.notes}`)
  text(summaryParts.join('  •  '), { size: 10, color: [90, 90, 90], gapAfter: 10 })
  hr()

  // -------- MEAL PLAN --------
  sectionTitle('7-Day Meal Plan')
  plan.meals.forEach((day) => {
    ensureSpace(80)
    text(day.day, { size: 16, style: 'bold', color: [97, 67, 17], gapAfter: 4 })

    const mealLine = (label, meal) => {
      if (!meal) return
      text(`${label}: ${meal.name}`, { size: 11, style: 'bold', gapAfter: 2 })
      if (meal.description) {
        text(meal.description, { size: 10, color: [90, 90, 90], gapAfter: 2 })
      }
      if (meal.prepTime) {
        text(`Prep: ${meal.prepTime}`, { size: 9, color: [120, 120, 120], gapAfter: 6 })
      } else {
        y += 4
      }
    }
    mealLine('Breakfast', day.breakfast)
    mealLine('Lunch', day.lunch)
    mealLine('Dinner', day.dinner)

    if (day.snacks && day.snacks.length) {
      const snackText = day.snacks.map((s) => s.name).join(' • ')
      text(`Snacks: ${snackText}`, { size: 10, style: 'italic', color: [120, 90, 40], gapAfter: 8 })
    }
    hr()
  })

  // -------- SHOPPING LIST --------
  doc.addPage()
  y = MARGIN
  sectionTitle('Shopping List')

  plan.shoppingList.forEach((section) => {
    ensureSpace(40)
    text(section.category, { size: 14, style: 'bold', color: [71, 106, 57], gapAfter: 4 })
    section.items.forEach((item) => {
      ensureSpace(16)
      // checkbox
      doc.setDrawColor(120, 120, 120)
      doc.setLineWidth(0.8)
      doc.rect(MARGIN, y - 9, 10, 10)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      doc.setTextColor(40, 56, 33)
      const label = item.quantity ? `${item.name} — ${item.quantity}` : item.name
      const lines = doc.splitTextToSize(label, contentW - 18)
      doc.text(lines, MARGIN + 16, y)
      y += lines.length * 13 + 2
    })
    y += 8
  })

  // -------- RECIPE CARDS --------
  doc.addPage()
  y = MARGIN
  sectionTitle('Recipe Cards')

  plan.meals.forEach((day) => {
    ;['breakfast', 'lunch', 'dinner'].forEach((slot) => {
      const meal = day[slot]
      if (!meal || !meal.method || !meal.method.length) return
      ensureSpace(120)
      text(`${day.day} — ${slot[0].toUpperCase() + slot.slice(1)}`,
        { size: 10, color: [120, 120, 120], gapAfter: 2 })
      text(meal.name, { size: 15, style: 'bold', color: [71, 106, 57], gapAfter: 4 })
      if (meal.prepTime) {
        text(`Prep time: ${meal.prepTime}  •  Serves ${prefs.servings}`,
          { size: 9, color: [120, 120, 120], gapAfter: 6 })
      }
      text('Ingredients', { size: 11, style: 'bold', gapAfter: 2 })
      meal.ingredients.forEach((i) => text(`• ${i}`, { size: 10, gapAfter: 1 }))
      y += 4
      text('Method', { size: 11, style: 'bold', gapAfter: 2 })
      meal.method.forEach((step, i) => text(`${i + 1}. ${step}`, { size: 10, gapAfter: 2 }))
      hr()
    })
  })

  doc.save(`meal-plan-${new Date().toISOString().slice(0, 10)}.pdf`)
}
