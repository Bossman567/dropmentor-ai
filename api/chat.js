let logs = []; // lihtne mälu (reset deployiga)

export default async function handler(req, res) {

  // 🔒 ADMIN VAATAMINE
  if (req.method === "GET") {
    const secret = req.headers["x-admin-key"];

    if (secret !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    return res.status(200).json({ logs });
  }

  // 💬 CHAT
  if (req.method === "POST") {
    try {
      const { message, tier } = req.body;

      let systemPrompt = "";

      if (tier === "pro") {
        systemPrompt = "You are an elite dropshipping strategist. Answer ANY question in a very detailed and structured way. Include: step-by-step plan, tools, examples, product ideas, pricing, cost, profit margin, supplier suggestions, and TikTok ad strategies.";
      } 
      else if (tier === "starter") {
        systemPrompt = "You are a practical dropshipping coach. Answer clearly and give 4-6 actionable steps, tools (Shopify, TikTok), and examples.";
      } 
      else {
        systemPrompt = "You are a helpful dropshipping assistant. Answer clearly with a short explanation, 3-4 tips, and 1-2 simple action steps.";
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
      const reply = data.choices?.[0]?.message?.content || "No response";

      // 🧠 salvesta log
      logs.push({
        message,
        tier,
        reply,
        time: new Date().toISOString()
      });

      return res.status(200).json({ reply });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
