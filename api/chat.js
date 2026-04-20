export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "API working" });
  }

  try {
    const { message, tier } = req.body;

    let systemPrompt = "";

    if (tier === "pro") {
      systemPrompt = "You are an elite dropshipping strategist. Answer ANY question in a very detailed way. Include step-by-step instructions, real examples, tools to use, and practical actions. If relevant, include product ideas, pricing, profit, suppliers, and ad strategies.";
    } 
    else if (tier === "starter") {
      systemPrompt = "You are a helpful dropshipping coach. Answer the user's question clearly and practically. Give useful steps and examples, but do not go too deep into advanced strategy or detailed profit breakdowns.";
    } 
    else {
      systemPrompt = "You are a simple dropshipping assistant. Answer the user's question briefly and clearly. Give basic guidance and simple next steps, but keep it short and not too detailed.";
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
