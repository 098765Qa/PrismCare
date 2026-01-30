/**
 * AI SERVICE
 * Handles communication with Azure OpenAI (o4-mini)
 */

const axios = require("axios");

async function generateSummary(prompt) {
  try {
    // Build the correct Azure OpenAI URL
    const url =
      process.env.AZURE_OPENAI_ENDPOINT +
      "/openai/chat/completions?api-version=" +
      process.env.AZURE_OPENAI_API_VERSION;

    // Send request to Azure OpenAI
    const response = await axios.post(
      url,
      {
        model: process.env.AZURE_OPENAI_DEPLOYMENT, // "o4-mini"
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_completion_tokens: 500,
      },
      {
        headers: {
          "api-key": process.env.AZURE_OPENAI_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // Return the AI-generated text
    return (
      response.data.choices?.[0]?.message?.content ||
      "No summary generated"
    );
  } catch (err) {
    // Print the REAL Azure error so we can debug
    console.error(
      "AI Service Error:",
      err.response?.data || err.message || err
    );

    return "Error generating summary";
  }
}

module.exports = { generateSummary };