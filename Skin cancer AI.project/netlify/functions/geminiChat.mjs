// Netlify Function v2 — Proxy Google Gemini Chat API
// รองรับทั้ง text-only chat และ vision (ส่งรูปวิเคราะห์)
// API key ฝังฝั่ง server เพื่อความปลอดภัย

const GEMINI_API_KEY = "AIzaSyDno0MelTGQEI_nn3FhoG6adHMJsKBm7Pw";
const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash-lite", "gemini-2.5-pro"];

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

        const payload = JSON.stringify({
            system_instruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }]
            },
            contents: [{ parts: parts }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
            },
        });

        // ลองเรียก Gemini API — fallback ถ้า model แรกใช้ไม่ได้
        let lastResponse = null;
        let data = null;
        for (const model of MODELS) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
            lastResponse = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload,
            });
            data = await lastResponse.json();

            // ถ้าสำเร็จ (มี candidates) หรือไม่ใช่ 403/404 ก็ใช้เลย
            if (data.candidates || (lastResponse.status !== 403 && lastResponse.status !== 404)) {
                break;
            }
        }

        // Check for Gemini API errors
        if (data.error) {
            const errMsg = data.error.message || JSON.stringify(data.error);
            return new Response(
                JSON.stringify({ response: `ขออภัย ระบบ AI ขัดข้อง: ${errMsg}` }),
                {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        // Extract response text — รองรับ thinking parts ของ gemini-2.5
        let responseText = "ไม่สามารถสร้างคำตอบได้ กรุณาลองใหม่อีกครั้ง";
        if (data.candidates && data.candidates.length > 0) {
            const candidate = data.candidates[0];
            if (candidate.finishReason === "SAFETY") {
                responseText = "ขออภัย ไม่สามารถตอบคำถามนี้ได้เนื่องจากข้อจำกัดด้านความปลอดภัย";
            } else if (candidate.content && candidate.content.parts) {
                // Filter out thinking parts (thought: true) and get actual text
                const textParts = candidate.content.parts.filter(
                    p => p.text !== undefined && p.text !== null && !p.thought
                );
                if (textParts.length > 0) {
                    responseText = textParts.map(p => p.text).join("");
                } else {
                    // Fallback: try any part with text
                    const anyText = candidate.content.parts.find(p => p.text);
                    if (anyText) responseText = anyText.text;
                }
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
            JSON.stringify({ response: `เกิดข้อผิดพลาด: ${error.message}` }),
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
