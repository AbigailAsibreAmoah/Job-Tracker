const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const https = require('https');

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_DEFAULT_REGION || 'us-east-1' });

const TABLE_NAME = process.env.TABLE_NAME;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

// Tavily AI-powered web search
async function searchWeb(query) {
  if (!TAVILY_API_KEY) {
    console.log('No Tavily API key, skipping web search');
    return { content: '', sources: [] };
  }

  return new Promise((resolve) => {
    const payload = JSON.stringify({
      api_key: TAVILY_API_KEY,
      query: query,
      max_results: 3,
      search_depth: 'basic',
      include_answer: true
    });

    const options = {
      hostname: 'api.tavily.com',
      path: '/search',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          const content = result.answer || result.results?.map(r => r.content).join('\n') || '';
          const sources = result.results?.map(r => r.title).slice(0, 2) || [];
          resolve({ content, sources });
        } catch (error) {
          console.error('Tavily parse error:', error);
          resolve({ content: '', sources: [] });
        }
      });
    });

    req.on('error', (error) => {
      console.error('Tavily request error:', error);
      resolve({ content: '', sources: [] });
    });

    req.write(payload);
    req.end();
  });
}

async function getUserApplications(userEmail) {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: 'user_email = :email',
    ExpressionAttributeValues: { ':email': userEmail }
  };
  
  const result = await docClient.send(new ScanCommand(params));
  return result.Items || [];
}

async function callBedrock(prompt) {
  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7
  };

  const command = new InvokeModelCommand({
    modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(payload)
  });

  const response = await bedrockClient.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.body));
  return result.content[0].text;
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { message, userEmail } = JSON.parse(event.body);
    
    // Get user's applications for context
    const applications = await getUserApplications(userEmail);
    
    // Determine if web search is needed
    const needsWebSearch = /how to|what is|who is|when to|where to|best practices|tips for|advice on|latest|current|recent/i.test(message);
    let webContext = '';
    let sources = [];
    
    if (needsWebSearch) {
      const searchResult = await searchWeb(message);
      webContext = searchResult.content;
      sources = searchResult.sources;
    }

    // Build context for AI
    const appContext = applications.length > 0 
      ? `User has ${applications.length} applications:\n${applications.slice(0, 5).map(app => 
          `- ${app.company} (${app.position}) - Status: ${app.status}${app.priority ? ', Priority: ' + app.priority : ''}`
        ).join('\n')}`
      : 'User has no applications yet.';

    const prompt = `You are Isla (Intelligent Search & Labor Assistant), an AI job search assistant. Be helpful, professional, and concise.

User Context:
${appContext}

${webContext ? `Web Search Result:\n${webContext}\n` : ''}

User Question: ${message}

Provide a helpful, actionable response. If discussing their applications, reference specific details. Keep responses under 150 words.`;

    const response = await callBedrock(prompt);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        response,
        sources: sources.length > 0 ? sources : undefined
      })
    };

  } catch (error) {
    console.error('Chat error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        response: 'I apologize, but I encountered an error. Please try again.' 
      })
    };
  }
};
