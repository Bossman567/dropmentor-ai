export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "API working" });
  }

  try {
    const { message, tier } = req.body;

    let systemPrompt = "";

    if (tier === "pro") {
      systemPrompt = `
You are an elite dropshipping strategist.

Answer the user's question in a VERY detailed and structured way.

Structure your answer like this:
1. Clear explanation
2. Step-by-step plan (6-10 steps)
3. Tools to use (Shopify, TikTok, etc)
4. Real examples
5. If relevant: product ideas, pricing, cost, profit, supplier, ad strategy

Be very practical and actionable.
`;
    } 
    else if (tier === "starter") {
      systemPrompt = `
You are a practical dropshipping coach.

Answer the user's question in a medium-detailed way.

Structure your answer like this:
1. Short explanation
2. 4-6 clear steps on how to start
3. Tools to use (Shopify, TikTok, etc)
4. 1 simple example

Be helpful and structured, but not too advanced.
`;
    } 
    else {
      systemPrompt = `
You are a helpful dropshipping assistant.

Answer the user's question in a useful but simple way.

Structure your answer like this:
1. Short explanation
2. 3-4 useful tips
3. 1-2 simple action steps

Make it helpful and not too short.
`;
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
