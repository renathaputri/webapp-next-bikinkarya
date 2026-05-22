import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

function getModel() {
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
}

// ── Brief generation prompt ───────────────────────────────
const FIELD_LABELS: Record<string, string> = {
  uiux: "UI/UX Design",
  graphicdesign: "Graphic Design",
  digimark: "Digital Marketing",
};

const DIFFICULTY_CONTEXT: Record<string, string> = {
  junior:
    "Scope kecil, brief jelas, deliverable spesifik. Minimal decision-making, deadline santai, revisi minim.",
  mid: "Scope menengah, workflow realistis, beberapa constraint. Ada objective bisnis, revisi mulai banyak, deadline realistis.",
  senior:
    "Scope kompleks, problem-solving strategis, stakeholder complexity tinggi, ambiguity tinggi, deadline ketat, revisi intens.",
};

export async function generateBrief(field: string, difficulty: string) {
  const model = getModel();
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

Respond ONLY with valid JSON object. No markdown, no code blocks, no explanation.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip markdown code fences if present
  const cleaned = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/, "");

  return JSON.parse(cleaned);
}

// ── Interview question generation ─────────────────────────
export async function generateInterviewQuestion(field: string) {
  const model = getModel();
  const fieldLabel = FIELD_LABELS[field] ?? field;

  const prompt = `Kamu adalah HRD senior di perusahaan teknologi Indonesia. Generate satu pertanyaan interview untuk posisi ${fieldLabel}.

Pertanyaan harus:
- Relevan dengan bidang ${fieldLabel}
- Menguji kemampuan praktis, bukan hafalan teori
- Cocok untuk level fresh graduate / junior
- Dalam bahasa Indonesia

Respond ONLY with valid JSON:
{
  "question": "pertanyaan interview",
  "category": "technical" | "behavioral" | "situational" | "portfolio",
  "hint": "hint singkat untuk membantu menjawab"
}

No markdown, no code blocks.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/, "");
  return JSON.parse(cleaned);
}

// ── Interview answer explanation ──────────────────────────
export async function generateExplanation(
  field: string,
  question: string
) {
  const model = getModel();
  const fieldLabel = FIELD_LABELS[field] ?? field;

  const prompt = `Kamu adalah mentor karir berpengalaman di bidang ${fieldLabel} di Indonesia.

Pertanyaan interview: "${question}"

Berikan penjelasan yang mencakup:
1. **approach** — cara pendekatan menjawab pertanyaan ini
2. **exampleAnswer** — contoh jawaban yang baik (2-3 paragraf)
3. **tips** — tips tambahan untuk menjawab (array of string, max 4)
4. **commonMistakes** — kesalahan umum yang harus dihindari (array of string, max 3)

Gunakan bahasa Indonesia. Respond ONLY with valid JSON. No markdown, no code blocks.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/, "");
  return JSON.parse(cleaned);
}
