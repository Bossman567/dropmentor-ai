export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "API working" });
  }

  try {
    const { message, pro } = req.body;

    const systemPrompt = pro
      ? "You are an elite dropshipping strategist. Give EXACTLY 3 winning products. For each product include: product name, target country, selling price, cost estimate, profit margin, supplier suggestion (AliExpress, CJdropshipping, etc), and a TikTok ad idea with a hook. Be extremely specific. No generic advice."
      : "You are a sharp dropshipping advisor. Give EXACTLY 3 product ideas. For each product include: product name, why it is trending RIGHT NOW, where to sell (TikTok, Shopify, etc), and ONE clear action step to start today. Keep it short but useful. Avoid generic advice.";

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
