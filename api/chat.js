export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "API working" });
  }

  try {
    const { message, tier } = req.body;

    let systemPrompt = "";

    if (tier === "pro") {
      systemPrompt = "You are an elite dropshipping strategist. Answer ANY question in a very detailed way. Always include step-by-step instructions, real examples, tools to use, and clear actions. If relevant, include product ideas, pricing, cost, profit margin, supplier suggestions, and a TikTok ad script. Be extremely specific and actionable.";
    } 
    else if (tier === "starter") {
      systemPrompt = "You are a practical dropshipping coach. Answer the user's question clearly with useful steps and examples. Explain how to start, what tools to use (like Shopify, TikTok, etc), and give 3-5 actionable steps. Keep it detailed but not too advanced. Avoid full profit breakdowns or deep strategies.";
    } 
    else {
      systemPrompt = "You are a helpful dropshipping assistant. Answer the user's question in a clear and useful way. Give a short explanation, 2-3 practical tips, and 1 simple action step. Make it helpful but not too detailed or strategic.";
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
