const functions = require("firebase-functions");
const { Gemini } = require("@google/generative-ai");

exports.handleWhatsApp = functions.https.onRequest(async (req, res) => {
  const userMessage = req.body.Body;
  const userNumber = req.body.From;

  // Gemini AI Integration
  const genAI = new Gemini(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `Analyze risk for: ${userMessage}. Respond with { age: number, income: number }`;
  const response = await model.generateContent(prompt);
  const { age, income } = JSON.parse(response.text());

  // Generate Portfolio
  const portfolio = age > 50 ? { equity: 30, debt: 70 } : { equity: 70, debt: 30 };

  // Save to Firestore
  await admin.firestore().collection("users").doc(userNumber).set({ portfolio });

  // Send WhatsApp Response
  res.set("Content-Type", "text/xml");
  res.send(`
    <Response>
      <Message>Your portfolio: Equity ${portfolio.equity}%, Debt ${portfolio.debt}%. View: https://your-link.idx.dev</Message>
    </Response>
  `);
});
