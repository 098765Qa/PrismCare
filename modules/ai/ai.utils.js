/**
 * AI UTILS
 * Helper functions for AI analysis
 */

// Detect simple safeguarding concerns in notes
function detectSafeguarding(notesText) {
  const keywords = ["abuse", "neglect", "harm", "risk", "injury"];
  const detected = keywords.filter(word => notesText.toLowerCase().includes(word));
  return detected;
}

// Simple medication risk calculation
function calculateMedicationRisk(marEntry) {
  if (!marEntry) return 0;
  let score = 0;
  if (marEntry.missedDoses > 2) score += 30;
  if (marEntry.wrongDosage) score += 30;
  if (marEntry.adverseEvents) score += 20;
  return score;
}

// Predict wellbeing from history (dummy logic)
function predictWellbeing(history) {
  let risk = "low";
  if (!history || history.length === 0) return { risk };
  const recentMood = history[0].mood || "good";
  if (recentMood === "poor") risk = "high";
  return { risk };
}

module.exports = { detectSafeguarding, calculateMedicationRisk, predictWellbeing };
