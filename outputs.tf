output "api_gateway_url" {
  description = "API Gateway endpoint URL"
  value       = module.backend.api_gateway_url
}

output "website_url" {
  description = "Frontend website URL"
  value       = module.frontend.website_url
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = module.backend.cognito_user_pool_id
}

output "cognito_user_pool_client_id" {
  description = "Cognito User Pool Client ID"
  value       = module.backend.cognito_user_pool_client_id
}

output "react_app_config" {
  description = "Environment variables for React app"
  value       = module.frontend.react_app_config
}