require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/ask-bot', async (req, res) => {
  const userMessage = req.body.message;
  const SYSTEM_PROMPT = "You are a professional and simple financial assistant chatbot for Wealthy Nivesh.";

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: `${SYSTEM_PROMPT}\nUser: ${userMessage}` }]
          }
        ]
      }
    );

    const reply = response.data.candidates[0].content.parts[0].text;
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Sorry, there was an error processing your request." });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
