// Netlify Function v2 — Proxy Ultralytics Blood Cell YOLO Prediction API
// Token ฝังฝั่ง server เพื่อความปลอดภัย

const UPSTREAM_URL = "https://predict-69a39d45b0b3fdb9e3e8-dproatj77a-as.a.run.app/predict";
const API_TOKEN = "ul_32efdbb1bbfa554aa323a73ed3f8d27b5d38bb9a";

export const config = {
    path: "/api/bloodCellPredict",
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
