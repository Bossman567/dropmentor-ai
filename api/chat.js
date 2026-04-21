let sessions = {};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "API working" });
  }

  try {
    const { message, tier, sessionId } = req.body;

    if (!message || message.length > 500) {
      return res.status(400).json({ error: "Invalid input" });
    }

    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    // loo session kui pole olemas
    if (!sessions[sessionId]) {
      sessions[sessionId] = [];
    }

    // lisa user message
    sessions[sessionId].push({ role: "user", content: message });

    // 🎯 base prompt (teemapiirang + plain text)
    const basePrompt = `
You are a dropshipping expert.

ONLY answer questions related to:
- dropshipping
- ecommerce
- online business
- making money online

If the question is NOT related, respond:
"This AI only answers dropshipping and online business related questions."

Always respond in plain text (no #, *, markdown or formatting).
`;

    let systemPrompt = "";

    if (tier === "pro") {
      systemPrompt = basePrompt + `
Answer in a VERY detailed and structured way:
- explanation
- step-by-step plan (6-10 steps)
- tools
- real examples
- product ideas, pricing, profit, supplier, ads
`;
    } 
    else if (tier === "starter") {
      systemPrompt = basePrompt + `
Answer with:
- explanation
- 4-6 steps
- tools
- simple example
`;
    } 
    else {
      systemPrompt = basePrompt + `
Answer with:
- short explanation
- 3-4 tips
- 1-2 action steps
`;
    }

    // 🧠 võta viimased 5 sõnumit
    const history = sessions[sessionId].slice(-5);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...history
        ]
      })
    });

    const data = await response.json();

    let reply = data.choices?.[0]?.message?.content || "No response";

    // ❌ eemalda markdown sümbolid
    reply = reply.replace(/[#*]/g, "");

    // salvesta AI vastus
    sessions[sessionId].push({ role: "assistant", content: reply });

    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
