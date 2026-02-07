#!/bin/bash
set -e

echo "Testing Job Tracker Infrastructure..."

terraform init
terraform validate
terraform plan

echo "Infrastructure test completed successfully!"