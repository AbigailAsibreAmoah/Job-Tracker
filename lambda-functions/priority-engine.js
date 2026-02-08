const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const dynamoClient = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(dynamoClient);
const bedrock = new BedrockRuntimeClient({ region: process.env.AWS_DEFAULT_REGION || 'us-east-1' });

exports.handler = async (event) => {
  try {
    const applications = await getAllApplications();
    
    for (const app of applications) {
      const priority = await calculatePriority(app);
      await updatePriority(app.user_id, app.application_id, priority);
    }

    console.log(`Updated priorities for ${applications.length} applications`);
    return { statusCode: 200, body: JSON.stringify({ updated: applications.length }) };
  } catch (error) {
    console.error('Error updating priorities:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

async function getAllApplications() {
  const result = await dynamodb.send(new ScanCommand({
    TableName: process.env.APPLICATIONS_TABLE
  }));
  return result.Items || [];
}

async function calculatePriority(app) {
  const prompt = `You are Isla, an AI job search assistant. Analyze this job application and assign a priority level (Critical, High, Medium, Low) with reasoning.

Application:
- Position: ${app.position}
- Company: ${app.company}
- Status: ${app.status}
- Applied: ${app.created_at}
- Notes: ${app.notes || 'None'}

Consider:
1. Time since application (>14 days = follow-up needed)
2. Interview scheduled = Critical
3. No response = check status
4. Deadline proximity

Return JSON: {"priority": "Critical|High|Medium|Low", "reason": "brief explanation", "action": "suggested action"}`;

  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }]
  };

  const command = new InvokeModelCommand({
    modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
    body: JSON.stringify(payload)
  });

  const response = await bedrock.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.body));
  const text = result.content[0].text;
  
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : { priority: 'Medium', reason: 'Default', action: 'Review application' };
}

async function updatePriority(userId, appId, priorityData) {
  await dynamodb.send(new UpdateCommand({
    TableName: process.env.APPLICATIONS_TABLE,
    Key: { user_id: userId, application_id: appId },
    UpdateExpression: 'SET priority = :p, priority_reason = :r, suggested_action = :a, updated_at = :u',
    ExpressionAttributeValues: {
      ':p': priorityData.priority,
      ':r': priorityData.reason,
      ':a': priorityData.action,
      ':u': new Date().toISOString()
    }
  }));
}
