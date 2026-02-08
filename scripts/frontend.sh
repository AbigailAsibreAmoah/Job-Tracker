#!/bin/bash
set -e

cd frontend/react-app

# Install dependencies (only if needed)
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
else
  echo "✓ Skipping npm install (no changes)"
fi

# Check if src files changed since last build
SRC_CHANGED=false
if [ ! -d "build" ]; then
  SRC_CHANGED=true
  echo "No build directory found, building..."
else
  # Check if any src file is newer than build directory
  if [ -n "$(find src -type f -newer build)" ]; then
    SRC_CHANGED=true
    echo "Source files changed, rebuilding..."
  else
    echo "✓ Skipping build (no changes)"
  fi
fi

# Build only if changes detected
if [ "$SRC_CHANGED" = true ]; then
  echo "Building React app..."
  npm run build
fi

# Always sync to S3 if build exists (in case S3 was modified)
if [ -d "build" ]; then
  echo "Deploying to S3..."
  aws s3 sync build/ s3://job-tracker-frontend-dev-l6x3u6ln/ --delete
  
  # Only invalidate CloudFront if we rebuilt or S3 was updated
  if [ "$SRC_CHANGED" = true ]; then
    echo "Invalidating CloudFront cache..."
    aws cloudfront create-invalidation --distribution-id E377VCCEDRM9LW --paths "/*"
  else
    echo "✓ Skipping CloudFront invalidation (no changes)"
  fi
  
  echo "Frontend deployed successfully!"
  echo "Visit: https://d23i7v2l7vxa2o.cloudfront.net"
else
  echo "Error: No build directory found. Run 'npm run build' first."
  exit 1
fi