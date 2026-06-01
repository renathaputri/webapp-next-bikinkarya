import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
  const models = ["gemini-flash-latest", "gemini-2.5-flash", "gemini-3.5-flash"];
  for (const m of models) {
    try {
        const model = genAI.getGenerativeModel({ model: m });
        const res = await model.generateContent("Hello!");
        console.log(m + " OK:", res.response.text());
        return; // success
    } catch(err) {
        console.error("Error with " + m + ":", err.message);
    }
  }
}
test();
