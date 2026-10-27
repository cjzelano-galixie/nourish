import dotenv from "dotenv";
dotenv.config();

async function testRawFetch() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

  console.log("Sending raw fetch to Google API...");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: "Parse this meal: 2 eggs and toast" }],
        },
      ],
    }),
  });

  const data = await response.json();
  console.log("Raw Response Status:", response.status);
  console.log("Raw Response Body:", JSON.stringify(data, null, 2));
}

testRawFetch();
