// modules/ai/ai.routes.js
const express = require('express');
const router = express.Router();

// Import AI controller functions
const {
  askAI,
  generateVisitSummary,
  generateWellbeingSummary,
  analyseMedication,
  predictWellbeing,
} = require('./ai.controller');

// -------------------------------
// ROUTES
// -------------------------------

// AI chat (POST) — user sends a message
// Example: POST /api/ai/ask { "message": "Hi AI!" }
router.post('/ask', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const reply = await askAI(message);
    return res.json({ reply });
  } catch (err) {
    console.error('AI Service Error:', err);
    return res.status(500).json({ error: 'AI service error' });
  }
});

// Generate visit summary (GET)
router.get('/visit-summary/:id', async (req, res) => {
  try {
    await generateVisitSummary(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate visit summary' });
  }
});

// Generate wellbeing summary (GET)
router.get('/wellbeing-summary/:id', async (req, res) => {
  try {
    await generateWellbeingSummary(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate wellbeing summary' });
  }
});

// Analyse MAR entry (GET)
router.get('/mar-analysis/:id', async (req, res) => {
  try {
    await analyseMedication(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to analyse MAR entry' });
  }
});

// Predict wellbeing trend (GET)
router.get('/wellbeing-predict/:clientId', async (req, res) => {
  try {
    await predictWellbeing(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to predict wellbeing' });
  }
});

module.exports = router;
