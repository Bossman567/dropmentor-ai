export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "API working" });
  }

  try {
    const { message, tier } = req.body;

    // AI annab alati täieliku (PRO) vastuse
    const fullPrompt = "You are an elite dropshipping strategist. Answer ANY question in a very detailed way. Include step-by-step instructions, tools, examples, product ideas, pricing, profit, supplier suggestions, and TikTok ad ideas. Be extremely specific.";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: fullPrompt },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    let fullAnswer = data.choices?.[0]?.message?.content || "No response";

    // 🔥 LÕIKAMINE (tier süsteem)
    let finalAnswer = fullAnswer;

    if (tier === "free") {
      finalAnswer = fullAnswer.substring(0, Math.floor(fullAnswer.length * 0.25)) 
        + "\n\n🔒 Unlock more details with Starter or PRO";
    } 
    else if (tier === "starter") {
      finalAnswer = fullAnswer.substring(0, Math.floor(fullAnswer.length * 0.55)) 
        + "\n\n🔒 Get full strategy with PRO";
    }

    return res.status(200).json({
      reply: finalAnswer
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
