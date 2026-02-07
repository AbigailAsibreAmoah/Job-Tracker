// analytics.js
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

/**
 * Allowed origins
 */
const ALLOWED_ORIGINS = [
  'https://d23i7v2l7vxa2o.cloudfront.net',
  'http://localhost:3000'
];

function getCorsHeaders(event) {
  const origin = event.headers?.origin || event.headers?.Origin;
  const allowOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers':
      'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
  };
}

exports.handler = async (event) => {
  const { httpMethod, pathParameters, body, requestContext } = event;
  const corsHeaders = getCorsHeaders(event);

  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  const userId = requestContext?.authorizer?.claims?.sub;
  if (!userId) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  try {
    if (httpMethod === 'GET') {
      return await getAnalytics(userId, corsHeaders);
    }

    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
};

async function getAnalytics(userId, headers) {
  const result = await dynamodb.send(
    new QueryCommand({
      TableName: process.env.APPLICATIONS_TABLE,
      KeyConditionExpression: 'user_id = :userId',
      ExpressionAttributeValues: { ':userId': userId }
    })
  );

  const applications = result.Items || [];
  const statusCounts = {};
  
  applications.forEach(app => {
    const status = app.status || 'Unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      total: applications.length,
      byStatus: statusCounts,
      applications
    })
  };
}
