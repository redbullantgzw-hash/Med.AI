// Netlify Function v2 — Proxy Ultralytics Chest X-Ray YOLO Prediction API
// Token ฝังฝั่ง server เพื่อความปลอดภัย (ไม่ต้องส่งจาก frontend แล้ว)

const UPSTREAM_URL = "https://predict-69a257cff20f47264cce-dproatj77a-as.a.run.app/predict";
const API_TOKEN = "ul_0fd5ac8b3d35fd1992e4618c92b504b78e4cb187";

export const config = {
    path: "/api/ultralyticsPredict",
};

export default async (req) => {
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
        const body = await req.arrayBuffer();

        const response = await fetch(UPSTREAM_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`,
                "Content-Type": req.headers.get("content-type") || "",
            },
            body: body,
        });

        const data = await response.text();

        return new Response(data, {
            status: response.status,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });
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
