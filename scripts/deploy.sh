#!/bin/bash
set -e

echo "Packaging Lambda functions..."

cd lambda-functions

# Install dependencies (only if needed)
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
else
  echo "✓ Skipping npm install (no changes)"
fi

# Zip job-applications Lambda
if [ ! -f "../backend/job_applications.zip" ] || [ "job-applications.js" -nt "../backend/job_applications.zip" ]; then
  echo "Zipping job-applications Lambda..."
  powershell -Command "Compress-Archive -Path job-applications.js,node_modules,package.json -DestinationPath ../backend/job_applications.zip -Force"
else
  echo "✓ Skipping job-applications (no changes)"
fi

# Zip analytics Lambda
if [ ! -f "../backend/analytics.zip" ] || [ "analytics.js" -nt "../backend/analytics.zip" ]; then
  echo "Zipping analytics Lambda..."
  powershell -Command "Compress-Archive -Path analytics.js,node_modules,package.json -DestinationPath ../backend/analytics.zip -Force"
else
  echo "✓ Skipping analytics (no changes)"
fi

# Zip URL parser Lambda
if [ ! -f "../backend/url_parser.zip" ] || [ "url-parser.js" -nt "../backend/url_parser.zip" ]; then
  echo "Zipping URL parser Lambda..."
  powershell -Command "Compress-Archive -Path url-parser.js,node_modules,package.json -DestinationPath ../backend/url_parser.zip -Force"
else
  echo "✓ Skipping URL parser (no changes)"
fi

# Zip priority engine Lambda
if [ ! -f "../backend/priority_engine.zip" ] || [ "priority-engine.js" -nt "../backend/priority_engine.zip" ]; then
  echo "Zipping priority engine Lambda..."
  powershell -Command "Compress-Archive -Path priority-engine.js,node_modules,package.json -DestinationPath ../backend/priority_engine.zip -Force"
else
  echo "✓ Skipping priority engine (no changes)"
fi

# Zip Isla chat Lambda
if [ ! -f "../backend/isla_chat.zip" ] || [ "isla-chat.js" -nt "../backend/isla_chat.zip" ]; then
  echo "Zipping Isla chat Lambda..."
  powershell -Command "Compress-Archive -Path isla-chat.js,node_modules,package.json -DestinationPath ../backend/isla_chat.zip -Force"
else
  echo "✓ Skipping Isla chat (no changes)"
fi

cd ..

echo "Deploying Job Tracker Infrastructure..."

terraform init
terraform validate
terraform plan
terraform apply -auto-approve

echo "Infrastructure deployed successfully!"
terraform output
