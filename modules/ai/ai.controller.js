/**
 * AI Controller — PrismCare AI Engine
 * Handles:
 * 1. AI Chat
 * 2. Summaries for Visits, Wellbeing, MAR
 */

const { OpenAI } = require("openai");
const Visit = require("../visits/visit.model");
const MAR = require("../mar/mar.model");
const Wellbeing = require("../wellbeing/wellbeing.model");
const Notification = require("../../models/Notification");

// Maintain last 20 chat messages
const chatHistory = [];

// ---------------------------
// Initialize OpenAI / Azure
// ---------------------------
let client;

if (process.env.AZURE_OPENAI_KEY) {
  // Using Azure OpenAI
  client = new OpenAI({
    apiKey: process.env.AZURE_OPENAI_KEY,
    basePath: process.env.AZURE_OPENAI_ENDPOINT,
    defaultQuery: {
      deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
    },
  });
} else if (process.env.OPENAI_API_KEY) {
  // Using OpenAI directly
  client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  throw new Error("No OpenAI or Azure OpenAI key found in .env");
}

// ---------------------------
// Helper: Generate AI Response
// ---------------------------
async function generateSummary(prompt) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // works with Azure OpenAI or OpenAI
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 400,
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("AI Service Error:", err);
    return "Error generating summary";
  }
}

// ---------------------------
// AI Chat
// ---------------------------
async function askAI(message) {
  // Add user message to history
  chatHistory.push({ role: "user", content: message });
  if (chatHistory.length > 20) chatHistory.splice(0, chatHistory.length - 20);

  // Format chat history for prompt
  const historyText = chatHistory
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const prompt = `You are PrismCare AI Assistant. 
Conversation so far:\n${historyText}\nLatest message: ${message}`;

  // Generate AI reply
  const reply = await generateSummary(prompt);

  // Add AI reply to history
  chatHistory.push({ role: "assistant", content: reply });

  return reply;
}

// ---------------------------
// Generate Visit Summary
// ---------------------------
async function generateVisitSummary(req, res) {
  try {
    const { id } = req.params;
    const visit = await Visit.findById(id).populate("clientId");
    if (!visit) return res.status(404).json({ message: "Visit not found" });

    const prompt = `Create a professional UK care visit summary. Visit Notes:\n${visit.notes || "No notes provided."}`;

    const summary = await generateSummary(prompt);

    return res.json({ summary });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error generating visit summary", error: err.message });
  }
}

// ---------------------------
// Generate Wellbeing Summary
// ---------------------------
async function generateWellbeingSummary(req, res) {
  try {
    const { id } = req.params;
    const wb = await Wellbeing.findById(id).populate("clientId");
    if (!wb) return res.status(404).json({ message: "Wellbeing entry not found" });

    const prompt = `Create a wellbeing summary for a care client. Data: ${JSON.stringify(wb, null, 2)}`;

    const summary = await generateSummary(prompt);

    return res.json({ summary });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error generating wellbeing summary", error: err.message });
  }
}

// ---------------------------
// Export Functions
// ---------------------------
module.exports = {
  askAI,
  generateVisitSummary,
  generateWellbeingSummary,
};
