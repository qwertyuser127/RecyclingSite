// api/chat.js
// Vercel serverless function. Runs on Vercel's servers, NOT in the browser.
// Your OpenAI key lives only here, as an environment variable — never in
// chatbot.html or chatbot.js, which anyone can view in a browser.
//
// Setup (one time, in the Vercel dashboard, not in code):
//   Project → Settings → Environment Variables
//   Name:  OPENAI_API_KEY
//   Value: <your new key>
//   → Save, then redeploy.

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server is missing OPENAI_API_KEY. Add it in Vercel → Settings → Environment Variables." });
    return;
  }

  const userMessage = (req.body && req.body.message ? String(req.body.message) : "").slice(0, 1000);
  if (!userMessage.trim()) {
    res.status(400).json({ error: "Missing 'message' in request body." });
    return;
  }

  const SYSTEM_PROMPT = `You are EcoMind-01, the Smart Recycling assistant for a student project site about recycling in Malta.
Answer clearly and concisely (2-5 sentences). Cover: what bin/bag things go in, Malta's national waste
collection schedule (Mon/Wed/Fri organic-white bag, Tue/Sat mixed-black bag, Thu recyclable-grey/green bag,
glass only 1st & 3rd Friday of the month), fines for not separating waste, e-waste/battery disposal,
the Beverage Container Refund Scheme, and general recycling best practice. If you don't know a Malta-specific
detail, say so honestly and suggest wastecollection.mt or WasteServ on 8007 2200. Keep emoji use minimal (none, ideally).`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage }
        ],
        max_tokens: 300,
        temperature: 0.6
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI error:", response.status, errText);
      res.status(502).json({ error: "Upstream AI request failed." });
      return;
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't come up with a reply just now.";
    res.status(200).json({ reply });
  } catch (err) {
    console.error("Chat function error:", err);
    res.status(500).json({ error: "Something went wrong talking to the AI." });
  }
}
