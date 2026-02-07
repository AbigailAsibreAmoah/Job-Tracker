// job-applications.js
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand
} = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

/**
 * Allowed origins
 */
const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : [
        'https://d23i7v2l7vxa2o.cloudfront.net',
        'http://localhost:3000'
      ]
);

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
    await ensureUserProfile(userId, requestContext.authorizer.claims);

    switch (httpMethod) {
      case 'GET':
        return await getApplications(userId, corsHeaders);

      case 'POST':
        return await createApplication(
          userId,
          JSON.parse(body || '{}'),
          corsHeaders
        );

      case 'PUT':
        if (!pathParameters?.id) throw new Error('Missing application ID');
        return await updateApplication(
          userId,
          pathParameters.id,
          JSON.parse(body || '{}'),
          corsHeaders
        );

      case 'DELETE':
        if (!pathParameters?.id) throw new Error('Missing application ID');
        return await deleteApplication(
          userId,
          pathParameters.id,
          corsHeaders
        );

      default:
        return {
          statusCode: 405,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
};

// ────────────────
// Helpers
// ────────────────

async function ensureUserProfile(userId, claims) {
  if (!claims) return;

  const userProfile = {
    user_id: userId,
    email: claims.email || '',
    given_name: claims.given_name || '',
    family_name: claims.family_name || '',
    updated_at: new Date().toISOString()
  };

  try {
    await dynamodb.send(
      new PutCommand({
        TableName: process.env.USERS_TABLE,
        Item: userProfile
      })
    );
  } catch (err) {
    console.error('Error saving user profile:', err);
  }
}

async function getApplications(userId, headers) {
  const result = await dynamodb.send(
    new QueryCommand({
      TableName: process.env.APPLICATIONS_TABLE,
      KeyConditionExpression: 'user_id = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    })
  );

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(result.Items || [])
  };
}

async function createApplication(userId, application, headers) {
  const item = {
    user_id: userId,
    application_id: Date.now().toString(),
    ...application,
    created_at: new Date().toISOString()
  };

  await dynamodb.send(
    new PutCommand({
      TableName: process.env.APPLICATIONS_TABLE,
      Item: item
    })
  );

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify(item)
  };
}

async function updateApplication(userId, applicationId, updates, headers) {
  const allowedFields = [
    'position',
    'company',
    'location',
    'salary',
    'status',
    'interview_round',
    'notes',
    'application_date'
  ];

  const values = { ':updated_at': new Date().toISOString() };
  const sets = ['updated_at = :updated_at'];

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      values[`:${field}`] = updates[field];
      sets.push(`${field} = :${field}`);
    }
  }

  if (sets.length === 1) {
    throw new Error('No valid fields to update');
  }

  await dynamodb.send(
    new UpdateCommand({
      TableName: process.env.APPLICATIONS_TABLE,
      Key: { user_id: userId, application_id: applicationId },
      UpdateExpression: `SET ${sets.join(', ')}`,
      ExpressionAttributeValues: values
    })
  );

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: 'Updated successfully' })
  };
}

async function deleteApplication(userId, applicationId, headers) {
  await dynamodb.send(
    new DeleteCommand({
      TableName: process.env.APPLICATIONS_TABLE,
      Key: { user_id: userId, application_id: applicationId }
    })
  );

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: 'Deleted successfully' })
  };
}
