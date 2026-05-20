export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    response.status(200).json({
      reply:
        "AI 服务还没有配置好。请先在 Vercel 环境变量里添加 OPENAI_API_KEY。现在我先用本地提示方式引导：请你先说明题目在问什么，再找一个已知条件。",
    });
    return;
  }

  try {
    const { studentName, grade, subject, question, studentReply, history = [] } = request.body || {};

    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        instructions: [
          "You are a Socratic learning coach for a middle/high school student in Texas.",
          "Do not directly reveal the final answer unless the student has already reasoned through the key step.",
          "Use short, warm, age-appropriate prompts.",
          "Ask one question at a time.",
          "If the student is stuck, give a small hint and ask them to try again.",
          "Keep responses under 90 Chinese characters unless a brief explanation is necessary.",
          "Reply in simplified Chinese unless the student writes in English and asks to practice English.",
        ].join("\n"),
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: JSON.stringify({
                  studentName,
                  grade,
                  subject,
                  currentQuestion: question,
                  recentHistory: history.slice(-6),
                  studentReply,
                  task: "Guide the student one step forward without giving the final answer directly.",
                }),
              },
            ],
          },
        ],
      }),
    });

    if (!openaiResponse.ok) {
      const message = await openaiResponse.text();
      throw new Error(message);
    }

    const data = await openaiResponse.json();
    const reply =
      data.output_text ||
      data.output?.flatMap((item) => item.content || []).find((item) => item.text)?.text ||
      "我们先慢一点。你能用自己的话说说题目问的是什么吗？";

    response.status(200).json({ reply });
  } catch (error) {
    response.status(200).json({
      reply:
        "AI 暂时没有连上。我先继续引导你：请找出题目里的关键词，并说说它排除了哪个选项。",
      detail: error.message,
    });
  }
}
