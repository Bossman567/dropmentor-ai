export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "API working" });
  }

  try {
    const { message, tier } = req.body;

    let systemPrompt = "";

    if (tier === "pro") {
      systemPrompt = "You are an elite dropshipping strategist. Answer ANY question in a very detailed and structured way. Include: clear explanation, step-by-step plan, tools to use, real examples, and practical actions. If relevant, include product ideas, pricing, cost, profit margin, supplier suggestions, and TikTok ad strategies. Make it very actionable and detailed.";
    } 
    else if (tier === "starter") {
      systemPrompt = "You are a practical dropshipping coach. Answer the user's question with a clear explanation and give 4-6 actionable steps. Include tools like Shopify, TikTok, etc. Add examples where possible. Keep it helpful and fairly detailed, but do not go into deep profit calculations or advanced strategy.";
    } 
    else {
      systemPrompt = "You are a helpful dropshipping assistant. Answer the user's question with a short explanation, 3-4 useful tips, and 1-2 simple action steps. Make it feel helpful and informative, not too short, but avoid deep strategy or detailed breakdowns.";
    }

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
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
