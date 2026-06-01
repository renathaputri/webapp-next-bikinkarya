import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Gemini API Key Fallback System
 * 
 * Supports multiple API keys that rotate automatically when one hits rate limits.
 * Set comma-separated keys in .env:
 *   GEMINI_API_KEY=key1,key2,key3
 * 
 * Or use separate env vars:
 *   GEMINI_API_KEY=main_key
 *   GEMINI_API_KEY_2=backup_key_1
 *   GEMINI_API_KEY_3=backup_key_2
 */

function getApiKeys(): string[] {
  const keys: string[] = [];

  // Primary: comma-separated keys in GEMINI_API_KEY
  const primary = process.env.GEMINI_API_KEY || "";
  if (primary) {
    keys.push(...primary.split(",").map((k) => k.trim()).filter(Boolean));
  }

  // Additional: numbered env vars GEMINI_API_KEY_2, _3, _4, ...
  for (let i = 2; i <= 10; i++) {
    const key = process.env[`GEMINI_API_KEY_${i}`];
    if (key) keys.push(key.trim());
  }

  if (keys.length === 0) {
    throw new Error("GEMINI_API_KEY is not set. Please add at least one API key.");
  }

  return keys;
}

// Track which key index to try next (round-robin across requests)
let currentKeyIndex = 0;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Generate content with Gemini using JSON mode (responseMimeType: application/json)
 * + round-robin key rotation + exponential backoff on rate limits.
 */
async function generateWithFallback(prompt: string): Promise<string> {
  const keys = getApiKeys();
  const maxRetries = Math.max(3, keys.length * 2);

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const keyIndex = (currentKeyIndex + attempt) % keys.length;
    const apiKey = keys[keyIndex];

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
        },
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      // Success — advance round-robin to next key for load distribution
      currentKeyIndex = (keyIndex + 1) % keys.length;
      return text;
    } catch (error: any) {
      const status = error?.status || error?.code || error?.httpStatusCode;
      const message = error?.message || "";
      const isRateLimit =
        status === 429 ||
        status === 503 ||
        message.includes("429") ||
        message.toLowerCase().includes("too many requests") ||
        message.toLowerCase().includes("quota") ||
        message.toLowerCase().includes("overloaded") ||
        message.toLowerCase().includes("resource has been exhausted");

      console.warn(
        `[Gemini] Key #${keyIndex + 1} failed (${isRateLimit ? "rate limit" : "error"}): ${message}`
      );

      if (isRateLimit && attempt < maxRetries - 1) {
        // Exponential backoff: 2s, 4s, 8s, ...
        const waitTime = 2000 * Math.pow(2, attempt);
        console.log(`[Gemini] Switching to key #${((keyIndex + 1) % keys.length) + 1}... waiting ${waitTime}ms`);
        await delay(waitTime);
        continue;
      }

      // If it's NOT a rate limit error, or all keys exhausted, throw
      if (!isRateLimit || attempt === maxRetries - 1) {
        throw error;
      }
    }
  }

  throw new Error("All Gemini API keys exhausted or rate limits exceeded. Please try again later.");
}

/**
 * Robust JSON extraction from Gemini response.
 * Even with responseMimeType, some edge cases may return wrapped text.
 */
function cleanJsonResponse(text: string): string {
  // Try 1: Already clean JSON (most common with responseMimeType)
  const trimmed = text.trim();
  if ((trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
    return trimmed;
  }

  // Try 2: Wrapped in markdown code blocks
  const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (match) return match[1].trim();

  // Try 3: Strip any leading/trailing non-JSON characters
  const jsonMatch = trimmed.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (jsonMatch) return jsonMatch[1];

  return trimmed;
}

/**
 * Safe JSON parse with descriptive error
 */
function safeJsonParse(text: string, context: string): any {
  const cleaned = cleanJsonResponse(text);
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error(`[Gemini] Failed to parse JSON for ${context}:`, cleaned.substring(0, 200));
    throw new Error(`AI menghasilkan respons yang tidak valid. Coba lagi ya!`);
  }
}

// ── Brief generation prompt ───────────────────────────────
const FIELD_LABELS: Record<string, string> = {
  uiux: "UI/UX Design",
  graphicdesign: "Graphic Design",
  digimark: "Digital Marketing",
  frontend: "Frontend Development",
};

const DIFFICULTY_CONTEXT: Record<string, string> = {
  junior:
    "Scope kecil, brief jelas, deliverable spesifik. Minimal decision-making, deadline santai, revisi minim.",
  mid: "Scope menengah, workflow realistis, beberapa constraint. Ada objective bisnis, revisi mulai banyak, deadline realistis.",
  senior:
    "Scope kompleks, problem-solving strategis, stakeholder complexity tinggi, ambiguity tinggi, deadline ketat, revisi intens.",
};

export async function generateBrief(field: string, difficulty: string) {
  const fieldLabel = FIELD_LABELS[field] ?? field;
  const diffContext = DIFFICULTY_CONTEXT[difficulty] ?? "";

  const prompt = `Kamu adalah creative director berpengalaman di Indonesia. Generate satu study case brief yang realistis untuk bidang ${fieldLabel} dengan level ${difficulty}.

Konteks difficulty: ${diffContext}

Brief harus mencakup:
1. **client** — nama brand fiktif tapi realistis (bukan brand nyata), industri, dan konteks bisnis singkat
2. **platform** — platform yang digunakan (web, mobile, social media, dll)
3. **targetUser** — demografi dan psikografi target audience
4. **goal** — tujuan bisnis yang terukur dan spesifik
5. **deliverables** — daftar output yang diharapkan (array of string)
6. **deadline** — tenggat waktu simulasi (misal: "5 hari kerja")
7. **constraints** — batasan teknis atau kreatif yang harus diikuti (array of string)
8. **expectedOutput** — arahan visual atau komunikasi yang perlu diikuti
9. **title** — judul singkat project (misal: "Redesign Landing Page GreenBox")

PENTING:
- Gunakan bahasa Indonesia
- Brief harus terasa seperti brief dari client nyata, bukan tugas kuliah
- Brand fiktif harus terdengar profesional dan masuk akal di Indonesia
- Sesuaikan kompleksitas dengan level difficulty

Respond ONLY with a valid JSON object.`;

  const text = await generateWithFallback(prompt);
  return safeJsonParse(text, "generateBrief");
}

// ── Interview question generation ─────────────────────────
export async function generateInterviewQuestion(field: string) {
  const fieldLabel = FIELD_LABELS[field] ?? field;

  const prompt = `Kamu adalah HRD senior di perusahaan teknologi Indonesia. Generate satu pertanyaan interview untuk posisi ${fieldLabel}.

Pertanyaan harus:
- Relevan dengan bidang ${fieldLabel}
- Menguji kemampuan praktis, bukan hafalan teori
- Cocok untuk level fresh graduate / junior
- Dalam bahasa Indonesia

Respond with a JSON object with these exact keys:
{
  "question": "pertanyaan interview dalam bahasa Indonesia",
  "category": "technical atau behavioral atau situational atau portfolio",
  "difficulty": "Easy atau Medium atau Hard",
  "hint": "hint singkat untuk membantu menjawab"
}`;

  const text = await generateWithFallback(prompt);
  return safeJsonParse(text, "generateInterviewQuestion");
}

// ── Interview answer explanation ──────────────────────────
export async function generateExplanation(
  field: string,
  question: string
) {
  const fieldLabel = FIELD_LABELS[field] ?? field;

  const prompt = `Kamu adalah mentor karir berpengalaman di bidang ${fieldLabel} di Indonesia.

Pertanyaan interview: "${question}"

Berikan penjelasan yang mencakup:
1. **idealAnswer** — contoh jawaban yang baik dan lengkap (2-3 paragraf)
2. **keyPoints** — poin-poin kunci yang harus disebutkan (array of string, max 4)
3. **commonMistakes** — kesalahan umum yang harus dihindari (array of string, max 3)

Gunakan bahasa Indonesia. Respond with a valid JSON object with keys: idealAnswer, keyPoints, commonMistakes.`;

  const text = await generateWithFallback(prompt);
  return safeJsonParse(text, "generateExplanation");
}
