output "cloudfront_distribution_id" {
  description = "CloudFront Distribution ID"
  value       = aws_cloudfront_distribution.frontend_distribution.id
}

output "cloudfront_domain_name" {
  description = "CloudFront Distribution Domain Name"
  value       = aws_cloudfront_distribution.frontend_distribution.domain_name
}

output "s3_bucket_name" {
  description = "S3 Bucket Name"
  value       = aws_s3_bucket.frontend_bucket.id
}

output "website_url" {
  description = "Website URL"
  value       = "https://${aws_cloudfront_distribution.frontend_distribution.domain_name}"
}

# Backend configuration for React app
output "react_app_config" {
  description = "Configuration for React app"
  value = {
    REACT_APP_API_URL             = var.api_gateway_url
    REACT_APP_USER_POOL_ID        = var.cognito_user_pool_id
    REACT_APP_USER_POOL_CLIENT_ID = var.cognito_user_pool_client_id
    REACT_APP_IDENTITY_POOL_ID    = var.cognito_identity_pool_id
    REACT_APP_AWS_REGION          = var.aws_region
  }
}