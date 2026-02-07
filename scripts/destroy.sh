#!/bin/bash
set -e

echo "Destroying Job Tracker Infrastructure..."

terraform destroy -auto-approve

echo "Infrastructure destroyed successfully!"