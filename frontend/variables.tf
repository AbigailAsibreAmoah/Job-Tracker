variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "job-tracker"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "domain_name" {
  description = "Custom domain name (optional)"
  type        = string
  default     = ""
}

variable "api_gateway_url" {
  description = "API Gateway URL from backend"
  type        = string
  default     = ""
}

variable "cognito_user_pool_id" {
  description = "Cognito User Pool ID from backend"
  type        = string
  default     = ""
}

variable "cognito_user_pool_client_id" {
  description = "Cognito User Pool Client ID from backend"
  type        = string
  default     = ""
}

variable "cognito_identity_pool_id" {
  description = "Cognito Identity Pool ID from backend"
  type        = string
  default     = ""
}