output "api_gateway_url" {
  description = "API Gateway endpoint URL"
  value       = "https://${aws_api_gateway_rest_api.job_tracker_api.id}.execute-api.${var.aws_region}.amazonaws.com/${aws_api_gateway_stage.job_tracker_stage.stage_name}"
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = aws_cognito_user_pool.job_tracker_pool.id
}

output "cognito_user_pool_client_id" {
  description = "Cognito User Pool Client ID"
  value       = aws_cognito_user_pool_client.job_tracker_client.id
}

output "cognito_identity_pool_id" {
  description = "Cognito Identity Pool ID"
  value       = aws_cognito_identity_pool.job_tracker_identity_pool.id
}

output "aws_region" {
  description = "AWS Region"
  value       = var.aws_region
}