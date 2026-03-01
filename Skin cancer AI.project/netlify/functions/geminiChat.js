/**
 * Netlify Serverless Function - Google Gemini Chat
 * Forwards chat messages to Google Gemini API
 * Avoids CORS errors
 */

const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    let requestBody;
    
    if (typeof event.body === 'string') {
      requestBody = JSON.parse(event.body);
    } else {
      requestBody = event.body;
    }

    const { message, apiKey } = requestBody;

    if (!message || !apiKey) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing message or apiKey' })
      };
    }

    // Call Google Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message
                }
              ]
            }
          ]
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      return {
        statusCode: geminiResponse.status,
        body: JSON.stringify({ 
          error: `Gemini API error: ${geminiResponse.statusText}`,
          details: errorData 
        })
      };
    }

    const data = await geminiResponse.json();

    // Extract response text
    let responseText = 'No response generated';
    if (data.candidates && data.candidates.length > 0) {
      const content = data.candidates[0].content;
      if (content && content.parts && content.parts.length > 0) {
        responseText = content.parts[0].text;
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        response: responseText,
        fullData: data
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
