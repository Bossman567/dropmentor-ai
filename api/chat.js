export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "API working" });
  }

  try {
    const { message, pro } = req.body;

    const systemPrompt = pro
      ? "You are a professional dropshipping consultant. Give exactly 3 winning products. For each product include: product name, selling price, cost estimate, profit margin, target country, supplier idea, and a TikTok ad script. Be very specific and actionable."
      : "You are a helpful dropshipping assistant. Give exactly 3 product ideas. For each product include: what it is, why it sells, where to sell it (TikTok, Shopify, etc), and 1 simple action step. Keep it useful but not too detailed. Do NOT include profit calculations or full strategy.";

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
