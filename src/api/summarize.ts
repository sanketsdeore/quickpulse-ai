import axios from 'axios';

const OPENROUTER_KEY = 'OPENROUTER_API_KEY'; // replace with your key
const MODEL = 'deepseek/deepseek-chat-v3-0324:free'; // free-tier model

export const summarizeArticle = async (content: string): Promise<string> => {
  try {
    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: MODEL,
        messages: [
          {
            role: 'user',
            content:
              `Summarize the following news article in 4–6 bullet points. Each bullet should:
- Start with a short bold-like title followed by ':' (just capitalize, do NOT use any asterisks or markdown)
- Then explain the detail clearly.
Avoid any extra text. Only return the bullet points.

Article:\n\n${content}`,
          },
        ],
        max_tokens: 200,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = res.data.choices?.[0]?.message?.content;
    return reply?.trim() || 'No summary available.';
  } catch (err: any) {
    console.error('🚨 OpenRouter error:', err.response?.data || err.message);
    return 'Error summarizing article.';
  }
};
