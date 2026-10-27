import express from "express";
import requireBody from "#middleware/requireBody";
import getUserFromToken from "#middleware/getUserFromToken";
import { createMealLogWithNutrients } from "#db/queries/mealLogs";

const router = express.Router();

router.post(
  "/",
  getUserFromToken,
  requireBody(["message"]),
  async (req, res, next) => {
    try {
      const { message } = req.body;
      const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

      const promptText = `You are Nourish, a supportive, warm, calm, and judgement-free nutrition companion. Analyze the following meal description and return ONLY a valid JSON object (no markdown formatting, no code blocks) with these exact keys:
- calories (number)
- protein (number, grams)
- carbs (number, grams)
- fat (number, grams)
- fiber (number, grams)
- sodium (number, mg)
- potassium (number, mg)
- encouragingNote (string, short warm sentence)

Meal description: "${message}"`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: promptText }],
            },
          ],
        }),
      });

      const data = await response.json();
      console.log("GEMINI STATUS:", response.status);

      if (!response.ok) {
        throw new Error(
          data.error?.message || `API Error status ${response.status}`,
        );
      }

      const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!candidateText) {
        throw new Error("No text response received from Gemini API.");
      }

      console.log("GEMINI TEXT:", candidateText);

      let cleaned = candidateText.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned
          .replace(/^```json/, "")
          .replace(/```$/, "")
          .trim();
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
      }

      const geminiResults = JSON.parse(cleaned);
      console.log("PARSED:", geminiResults);

      const newPendingLog = await createMealLogWithNutrients(
        req.user.id,
        { mealDescription: message, status: "pending" },
        geminiResults,
      );

      res.status(201).json({
        ...newPendingLog,
        encouragingNote: geminiResults.encouragingNote,
      });
    } catch (err) {
      console.error("DIRECT AI ROUTE ERROR:", err.message || err);
      next(err);
    }
  },
);

export default router;
