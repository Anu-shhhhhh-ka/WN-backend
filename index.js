import express from 'express';
import axios from 'axios';
import cors from 'cors';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ⬇️ Read the content from your uploaded knowledge base
const faqContent = fs.readFileSync('./wealthy-nivesh-faq.txt', 'utf8');

// ⬇️ Gemini system prompt using the uploaded FAQ
const SYSTEM_PROMPT = `
You are the official chatbot for Wealthy Nivesh.

You must only answer using the information in the knowledge base below.
If asked something unrelated to Wealthy Nivesh, respond with:
"I'm only trained to answer queries related to Wealthy Nivesh and its services."

--- KNOWLEDGE BASE START ---
${faqContent}
--- KNOWLEDGE BASE END ---
`;

app.post('/ask-bot', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          { parts: [{ text: `${SYSTEM_PROMPT}\nUser: ${userMessage}` }] }
        ]
      }
    );

    const reply = response.data.candidates[0].content.parts[0].text;
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Sorry, something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`Wealthy Nivesh chatbot server is running on port ${PORT}`);
});
