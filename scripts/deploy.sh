#!/bin/bash
set -e

echo "Packaging Lambda functions..."

cd lambda-functions

# Install dependencies
npm install

echo "Zipping job-applications Lambda..."
powershell -Command "Compress-Archive -Path job-applications.js,node_modules,package.json -DestinationPath ../backend/job_applications.zip -Force"

echo "Zipping analytics Lambda..."
powershell -Command "Compress-Archive -Path analytics.js,node_modules,package.json -DestinationPath ../backend/analytics.zip -Force"

cd ..

echo "Deploying Job Tracker Infrastructure..."

terraform init
terraform validate
terraform plan
terraform apply -auto-approve

echo "Infrastructure deployed successfully!"
terraform output
