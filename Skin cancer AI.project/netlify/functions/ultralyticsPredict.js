/**
 * Netlify Serverless Function - Ultralytics YOLO Prediction
 * Forwards image data to Ultralytics Cloud API
 * Avoids CORS and 504 Gateway Timeout errors
 */

const fetch = require('node-fetch');
const FormData = require('form-data');

exports.handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse multipart form data
    const body = event.body;
    const isBase64 = event.isBase64Encoded;
    
    // Reconstruct file and parameters
    const bodyBuffer = Buffer.from(body, isBase64 ? 'base64' : 'utf-8');
    
    // Create FormData to send to Ultralytics API
    const form = new FormData();
    
    // Extract boundary from content-type header
    const contentType = event.headers['content-type'] || '';
    const boundary = contentType.split('boundary=')[1];
    
    if (!boundary) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid multipart form data' })
      };
    }

    // Parse multipart form data manually
    const parts = bodyBuffer.toString('binary').split(`--${boundary}`);
    
    let fileBuffer = null;
    let fileHeaders = {};
    const params = {};

    parts.forEach((part, index) => {
      if (!part.trim() || part === '--') return;

      const [headerSection, ...contentSection] = part.split('\r\n\r\n');
      const content = contentSection.join('\r\n\r\n').replace(/\r\n$/, '');

      // Parse headers
      const headerLines = headerSection.split('\r\n').filter(line => line.trim());
      const dispositionHeader = headerLines.find(h => 
        h.toLowerCase().startsWith('content-disposition')
      );

      if (!dispositionHeader) return;

      // Extract field name
      const nameMatch = dispositionHeader.match(/name="([^"]*)"/);
      const filenameMatch = dispositionHeader.match(/filename="([^"]*)"/);
      const fieldName = nameMatch ? nameMatch[1] : null;

      if (filenameMatch) {
        // This is a file field
        fileBuffer = Buffer.from(content, 'binary');
        fileHeaders = {
          filename: filenameMatch[1],
          contentType: headerLines.find(h => 
            h.toLowerCase().startsWith('content-type')
          ) || 'application/octet-stream'
        };
      } else if (fieldName) {
        // This is a regular parameter
        params[fieldName] = content.trim();
      }
    });

    if (!fileBuffer) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No file provided' })
      };
    }

    // Create new FormData for Ultralytics API
    const forwardForm = new FormData();
    
    // Append file
    const Readable = require('stream').Readable;
    const fileStream = Readable.from(fileBuffer);
    forwardForm.append('file', fileStream, {
      filename: fileHeaders.filename || 'image.jpg',
      contentType: fileHeaders.contentType
    });

    // Append parameters
    if (params.conf) forwardForm.append('conf', params.conf);
    if (params.iou) forwardForm.append('iou', params.iou);
    if (params.imgsz) forwardForm.append('imgsz', params.imgsz);

    // Call Ultralytics API with bearer token from frontend
    const authHeader = event.headers['authorization'] || '';
    
    const response = await fetch(
      'https://predict-69a257cff20f47264cce-dproatj77a-as.a.run.app/predict',
      {
        method: 'POST',
        headers: {
          'Authorization': authHeader
        },
        body: forwardForm
      }
    );

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Ultralytics API error: ${response.statusText}` })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
