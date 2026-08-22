export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({
        error: "messages harus berupa array"
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Authorization":
            `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type": "application/json",

          "HTTP-Referer":
            "https://ox-alpha-chat.vercel.app",

          "X-Title":
            "Ox Alpha Chat"
        },

        body: JSON.stringify({
          model: "stealth/ox-alpha",

          messages: messages
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          data?.error?.message ||
          "OpenRouter request gagal"
      });
    }

    const reply =
      data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        error: "Ox Alpha tidak mengembalikan jawaban"
      });
    }

    return res.status(200).json({
      reply
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
