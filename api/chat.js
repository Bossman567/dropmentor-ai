export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "API working" });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
         {
  role: "system",
  content: "You are a global dropshipping expert. Always reply in the same language as the user. Give specific winning product ideas, target country suggestions, supplier tips, ad angles, and step-by-step actions. Avoid generic advice."
}
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    return res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
