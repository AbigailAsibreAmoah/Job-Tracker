#!/bin/bash
set -e

echo "Building React app..."
cd frontend/react-app
npm install
npm run build

echo "Deploying to S3..."
aws s3 sync build/ s3://job-tracker-frontend-dev-l6x3u6ln/ --delete

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id E377VCCEDRM9LW --paths "/*"

echo "Frontend deployed successfully!"
echo "Visit: https://d23i7v2l7vxa2o.cloudfront.net"