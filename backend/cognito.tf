resource "aws_cognito_user_pool" "job_tracker_pool" {
  name = "${var.project_name}-users-${var.environment}"

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  auto_verified_attributes = ["email"]
  username_attributes     = ["email"]

  tags = {
    Name        = "${var.project_name}-user-pool"
    Environment = var.environment
  }

  lifecycle {
    ignore_changes = [
      schema
    ]
  }
}

resource "aws_cognito_user_pool_client" "job_tracker_client" {
  name         = "${var.project_name}-client-${var.environment}"
  user_pool_id = aws_cognito_user_pool.job_tracker_pool.id

  generate_secret                      = false
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["email", "openid", "profile"]
  callback_urls                        = ["https://d23i7v2l7vxa2o.cloudfront.net", "http://localhost:3000"]
  logout_urls                          = ["https://d23i7v2l7vxa2o.cloudfront.net", "http://localhost:3000"]

  supported_identity_providers = ["COGNITO"]

  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]
}

resource "aws_cognito_identity_pool" "job_tracker_identity_pool" {
  identity_pool_name               = "${var.project_name}_identity_pool_${var.environment}"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.job_tracker_client.id
    provider_name           = aws_cognito_user_pool.job_tracker_pool.endpoint
    server_side_token_check = false
  }
}

resource "aws_cognito_identity_pool_roles_attachment" "job_tracker_roles" {
  identity_pool_id = aws_cognito_identity_pool.job_tracker_identity_pool.id

  roles = {
    "authenticated" = aws_iam_role.cognito_authenticated_role.arn
  }
}

resource "aws_iam_role" "cognito_authenticated_role" {
  name = "${var.project_name}-cognito-authenticated-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.job_tracker_identity_pool.id
          }
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "authenticated"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "cognito_authenticated_policy" {
  name = "${var.project_name}-cognito-authenticated-policy-${var.environment}"
  role = aws_iam_role.cognito_authenticated_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "execute-api:Invoke"
        ]
        Resource = "${aws_api_gateway_rest_api.job_tracker_api.execution_arn}/*"
      }
    ]
  })
}