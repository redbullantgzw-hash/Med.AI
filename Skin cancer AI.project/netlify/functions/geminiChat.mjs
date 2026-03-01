// Netlify Function v2 — Proxy Google Gemini Chat API
// รองรับทั้ง text-only chat และ vision (ส่งรูปวิเคราะห์)
// API key ฝังฝั่ง server เพื่อความปลอดภัย

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const GEMINI_API_KEY = "AIzaSyDkgkVeDQRNK633f6gA87Vohj3koJp5Zno";

const SYSTEM_INSTRUCTION = "คุณเป็นผู้ช่วย AI ด้านการแพทย์ชื่อ MediAI ตอบคำถามเกี่ยวกับสุขภาพและการแพทย์อย่างเป็นมิตร ให้ข้อมูลที่ถูกต้องและเข้าใจง่าย พร้อมแนะนำให้ปรึกษาแพทย์เมื่อจำเป็น ตอบเป็นภาษาไทยเป็นหลัก ยกเว้นผู้ถามใช้ภาษาอังกฤษ";

export const config = {
    path: "/api/geminiChat",
};

export default async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    }

    try {
        const bodyData = await req.json();
        const { message, imageBase64, mimeType } = bodyData;

        if (!message) {
            return new Response(
                JSON.stringify({ error: "Missing message" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        // สร้าง parts — รองรับทั้ง text-only และ vision (image + text)
        let parts = [];
        if (imageBase64 && mimeType) {
            parts = [
                { text: message },
                { inline_data: { mime_type: mimeType, data: imageBase64 } },
            ];
        } else {
            parts = [{ text: message }];
        }

        // Forward ไปยัง Gemini API with system instruction
        const response = await fetch(`${GEMINI_BASE}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: SYSTEM_INSTRUCTION }]
                },
                contents: [{ parts: parts }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                },
            }),
        });

        const data = await response.json();

        // Check for Gemini API errors first
        if (data.error) {
            const errMsg = data.error.message || JSON.stringify(data.error);
            return new Response(
                JSON.stringify({ response: `API Error: ${errMsg}`, error: true }),
                {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        // Extract response text
        let responseText = "ไม่สามารถสร้างคำตอบได้ กรุณาลองใหม่อีกครั้ง";
        if (data.candidates && data.candidates.length > 0) {
            const candidate = data.candidates[0];
            // Check for blocked/filtered content
            if (candidate.finishReason === "SAFETY") {
                responseText = "ขออภัย ไม่สามารถตอบคำถามนี้ได้เนื่องจากข้อจำกัดด้านความปลอดภัย";
            } else if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                responseText = candidate.content.parts[0].text;
            }
        } else if (data.promptFeedback && data.promptFeedback.blockReason) {
            responseText = `คำถามถูกบล็อก: ${data.promptFeedback.blockReason}`;
        }

        return new Response(
            JSON.stringify({ response: responseText }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ response: `เกิดข้อผิดพลาด: ${error.message}`, error: true }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
    }
};
