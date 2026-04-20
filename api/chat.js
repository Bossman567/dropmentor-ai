export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "API working" });
  }

  try {
    const { message, tier } = req.body;

    let systemPrompt = "";

    if (tier === "pro") {
      systemPrompt = "You are an elite dropshipping strategist. Answer ANY question in a very detailed way. Include step-by-step instructions, tools to use, real examples, and clear actions. If relevant, include product ideas, pricing, cost, profit margin, supplier suggestions, and TikTok ad strategies. Be extremely specific and practical.";
    } 
    else if (tier === "starter") {
      systemPrompt = "You are a practical dropshipping coach. Answer the user's question clearly and give useful steps. Include how to start, what tools to use (Shopify, TikTok, etc), and 3-5 actionable steps. Keep it helpful but not too advanced.";
    } 
    else {
      systemPrompt = "You are a helpful dropshipping assistant. Answer the user's question in a simple and useful way. Give a short explanation, 2-3 tips, and 1 clear action step. Keep it concise but helpful.";
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
