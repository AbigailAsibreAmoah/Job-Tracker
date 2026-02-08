const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const https = require('https');

const bedrock = new BedrockRuntimeClient({ region: process.env.AWS_DEFAULT_REGION || 'us-east-1' });

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://d23i7v2l7vxa2o.cloudfront.net',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
  'Access-Control-Allow-Methods': 'POST,OPTIONS'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  const userId = event.requestContext?.authorizer?.claims?.sub;
  if (!userId) {
    return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    const { url } = JSON.parse(event.body || '{}');
    if (!url) throw new Error('URL is required');

    const htmlContent = await fetchURL(url);
    const jobData = await extractJobData(htmlContent, url);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(jobData)
    };
  } catch (error) {
    console.error('Error parsing job URL:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};

async function fetchURL(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function extractJobData(html, url) {
  const prompt = `You are Isla, an AI job search assistant. Extract job application details from this HTML content. Return ONLY valid JSON with these fields:
{
  "position": "job title",
  "company": "company name",
  "location": "location or Remote",
  "salary": "salary range or empty string",
  "description": "brief description",
  "requirements": "key requirements"
}

HTML content:
${html.substring(0, 8000)}`;

  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: prompt
    }]
  };

  const command = new InvokeModelCommand({
    modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
    body: JSON.stringify(payload)
  });

  const response = await bedrock.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.body));
  const text = result.content[0].text;
  
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : { position: '', company: '', location: '', salary: '', description: '', requirements: '' };
}
