#!/bin/bash
set -e

echo "Testing Job Tracker Infrastructure..."
echo ""

# Get API URL from Terraform output
API_URL=$(terraform output -raw api_gateway_url 2>/dev/null || echo "")

if [ -z "$API_URL" ]; then
  echo "Error: Could not get API URL from Terraform output"
  echo "Run './scripts/deploy.sh' first"
  exit 1
fi

echo "API Gateway URL: $API_URL"
echo ""

# Test Isla Chat Lambda directly
echo "Testing Isla Chat Lambda..."
aws lambda invoke \
  --function-name job-tracker-isla-chat-dev \
  --payload '{"httpMethod":"POST","body":"{\"message\":\"Hello Isla\",\"userEmail\":\"test@example.com\"}"}' \
  --cli-binary-format raw-in-base64-out \
  response.json > /dev/null 2>&1

if [ -f response.json ]; then
  echo "✓ Isla Chat Lambda test passed"
  cat response.json | grep -q '"statusCode":200' && echo "✓ Response: 200 OK" || echo "✗ Response error"
  rm response.json
else
  echo "✗ Isla Chat Lambda test failed"
fi

echo ""
echo "Infrastructure test completed!"