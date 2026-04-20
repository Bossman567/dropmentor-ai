export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "API working" });
  }

  try {
    const { message, tier } = req.body;

    let systemPrompt = "";

    if (tier === "pro") {
      systemPrompt = "You are an elite dropshipping strategist. Give EXACTLY 3 winning products. For each include: product name, target country, selling price, cost estimate, profit margin, supplier suggestion (AliExpress, CJdropshipping, etc), a TikTok ad idea with a hook, and a clear step-by-step plan on how to start from zero.";
    } 
    else if (tier === "starter") {
      systemPrompt = "You are a beginner-friendly dropshipping coach. Give EXACTLY 3 product ideas. For each include: what it is, why it sells, where to sell it, and explain step-by-step how to start (store setup, platform, basic marketing). Keep it simple but practical.";
    } 
    else {
      systemPrompt = "You are a helpful dropshipping assistant. Give EXACTLY 3 product ideas. For each include: product name, why it is trending right now, where to sell it, and ONE simple action step to start today.";
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
