// Netlify Function v2 — Proxy Google Gemini Chat API
// รองรับทั้ง text-only chat และ vision (ส่งรูปวิเคราะห์)
// API key ฝังฝั่ง server เพื่อความปลอดภัย

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const GEMINI_API_KEY = "AIzaSyDkgkVeDQRNK633f6gA87Vohj3koJp5Zno";

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
            // Vision request: ส่งรูป + prompt
            parts = [
                { text: message },
                { inline_data: { mime_type: mimeType, data: imageBase64 } },
            ];
        } else {
            // Text-only request
            parts = [{ text: message }];
        }

        // Forward ไปยัง Gemini API
        const response = await fetch(`${GEMINI_BASE}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: parts }],
            }),
        });

        const data = await response.json();

        // Extract response text
        let responseText = "No response generated";
        if (data.candidates && data.candidates.length > 0) {
            const content = data.candidates[0].content;
            if (content && content.parts && content.parts.length > 0) {
                responseText = content.parts[0].text;
            }
        }

        return new Response(
            JSON.stringify({ response: responseText, fullData: data }),
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
            JSON.stringify({ error: error.message }),
            {
                status: 502,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
    }
};
