# REST API
resource "aws_api_gateway_rest_api" "job_tracker_api" {
  name        = "${var.project_name}-api-${var.environment}"
  description = "Job Tracker API"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

# Cognito Authorizer
resource "aws_api_gateway_authorizer" "cognito_authorizer" {
  name        = "job-tracker-cognito-authorizer"
  rest_api_id = aws_api_gateway_rest_api.job_tracker_api.id
  type        = "COGNITO_USER_POOLS"

  provider_arns = [
    aws_cognito_user_pool.job_tracker_pool.arn
  ]

  identity_source = "method.request.header.Authorization"
}

# Applications Resource
resource "aws_api_gateway_resource" "applications" {
  rest_api_id = aws_api_gateway_rest_api.job_tracker_api.id
  parent_id   = aws_api_gateway_rest_api.job_tracker_api.root_resource_id
  path_part   = "applications"
}

# OPTIONS /applications
resource "aws_api_gateway_method" "applications_options" {
  rest_api_id   = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id   = aws_api_gateway_resource.applications.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "applications_options_200" {
  rest_api_id = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id = aws_api_gateway_resource.applications.id
  http_method = aws_api_gateway_method.applications_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration" "applications_options" {
  rest_api_id = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id = aws_api_gateway_resource.applications.id
  http_method = aws_api_gateway_method.applications_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_integration_response" "applications_options_200" {
  rest_api_id = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id = aws_api_gateway_resource.applications.id
  http_method = aws_api_gateway_method.applications_options.http_method
  status_code = aws_api_gateway_method_response.applications_options_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'https://d23i7v2l7vxa2o.cloudfront.net'"
  }
}

# GET /applications
resource "aws_api_gateway_method" "applications_get" {
  rest_api_id   = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id   = aws_api_gateway_resource.applications.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id
}

resource "aws_api_gateway_integration" "applications_get_lambda" {
  rest_api_id             = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id             = aws_api_gateway_resource.applications.id
  http_method             = aws_api_gateway_method.applications_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.job_applications_api.invoke_arn
}

# POST /applications
resource "aws_api_gateway_method" "applications_post" {
  rest_api_id   = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id   = aws_api_gateway_resource.applications.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id
}

resource "aws_api_gateway_integration" "applications_post_lambda" {
  rest_api_id             = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id             = aws_api_gateway_resource.applications.id
  http_method             = aws_api_gateway_method.applications_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.job_applications_api.invoke_arn
}

# PUT /applications/{id}
resource "aws_api_gateway_resource" "application_id" {
  rest_api_id = aws_api_gateway_rest_api.job_tracker_api.id
  parent_id   = aws_api_gateway_resource.applications.id
  path_part   = "{id}"
}

# OPTIONS /applications/{id}
resource "aws_api_gateway_method" "application_id_options" {
  rest_api_id   = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id   = aws_api_gateway_resource.application_id.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "application_id_options_200" {
  rest_api_id = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id = aws_api_gateway_resource.application_id.id
  http_method = aws_api_gateway_method.application_id_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration" "application_id_options" {
  rest_api_id = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id = aws_api_gateway_resource.application_id.id
  http_method = aws_api_gateway_method.application_id_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_integration_response" "application_id_options_200" {
  rest_api_id = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id = aws_api_gateway_resource.application_id.id
  http_method = aws_api_gateway_method.application_id_options.http_method
  status_code = aws_api_gateway_method_response.application_id_options_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'"
    "method.response.header.Access-Control-Allow-Methods" = "'PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'https://d23i7v2l7vxa2o.cloudfront.net'"
  }
}

resource "aws_api_gateway_method" "applications_put" {
  rest_api_id   = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id   = aws_api_gateway_resource.application_id.id
  http_method   = "PUT"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id
}

resource "aws_api_gateway_integration" "applications_put_lambda" {
  rest_api_id             = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id             = aws_api_gateway_resource.application_id.id
  http_method             = aws_api_gateway_method.applications_put.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.job_applications_api.invoke_arn
}

# DELETE /applications/{id}
resource "aws_api_gateway_method" "applications_delete" {
  rest_api_id   = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id   = aws_api_gateway_resource.application_id.id
  http_method   = "DELETE"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id
}

resource "aws_api_gateway_integration" "applications_delete_lambda" {
  rest_api_id             = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id             = aws_api_gateway_resource.application_id.id
  http_method             = aws_api_gateway_method.applications_delete.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.job_applications_api.invoke_arn
}

# Analytics Resource
resource "aws_api_gateway_resource" "analytics" {
  rest_api_id = aws_api_gateway_rest_api.job_tracker_api.id
  parent_id   = aws_api_gateway_rest_api.job_tracker_api.root_resource_id
  path_part   = "analytics"
}

# OPTIONS /analytics
resource "aws_api_gateway_method" "analytics_options" {
  rest_api_id   = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id   = aws_api_gateway_resource.analytics.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "analytics_options_200" {
  rest_api_id = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id = aws_api_gateway_resource.analytics.id
  http_method = aws_api_gateway_method.analytics_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration" "analytics_options" {
  rest_api_id = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id = aws_api_gateway_resource.analytics.id
  http_method = aws_api_gateway_method.analytics_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_integration_response" "analytics_options_200" {
  rest_api_id = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id = aws_api_gateway_resource.analytics.id
  http_method = aws_api_gateway_method.analytics_options.http_method
  status_code = aws_api_gateway_method_response.analytics_options_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'https://d23i7v2l7vxa2o.cloudfront.net'"
  }
}

# GET /analytics
resource "aws_api_gateway_method" "analytics_get" {
  rest_api_id   = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id   = aws_api_gateway_resource.analytics.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id
}

resource "aws_api_gateway_integration" "analytics_lambda" {
  rest_api_id             = aws_api_gateway_rest_api.job_tracker_api.id
  resource_id             = aws_api_gateway_resource.analytics.id
  http_method             = aws_api_gateway_method.analytics_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.analytics_api.invoke_arn
}

# Lambda Permissions
resource "aws_lambda_permission" "api_gateway_applications" {
  statement_id  = "AllowExecutionFromAPIGatewayApplications"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.job_applications_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.job_tracker_api.execution_arn}/${aws_api_gateway_stage.job_tracker_stage.stage_name}/*/*"
}

resource "aws_lambda_permission" "api_gateway_analytics" {
  statement_id  = "AllowExecutionFromAPIGatewayAnalytics"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.analytics_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.job_tracker_api.execution_arn}/${aws_api_gateway_stage.job_tracker_stage.stage_name}/*/*"
}

# Deployment
resource "aws_api_gateway_deployment" "job_tracker_deployment" {
  depends_on = [
    aws_api_gateway_authorizer.cognito_authorizer,
    aws_api_gateway_integration.applications_get_lambda,
    aws_api_gateway_integration.applications_post_lambda,
    aws_api_gateway_integration.applications_put_lambda,
    aws_api_gateway_integration.applications_delete_lambda,
    aws_api_gateway_integration.analytics_lambda,
    aws_api_gateway_integration_response.applications_options_200,
    aws_api_gateway_integration_response.application_id_options_200,
    aws_api_gateway_integration_response.analytics_options_200,
  ]

  rest_api_id = aws_api_gateway_rest_api.job_tracker_api.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_authorizer.cognito_authorizer.id,
      aws_api_gateway_method.applications_get.id,
      aws_api_gateway_method.applications_post.id,
      aws_api_gateway_method.applications_put.id,
      aws_api_gateway_method.applications_delete.id,
      aws_api_gateway_method.analytics_get.id
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Stage
resource "aws_api_gateway_stage" "job_tracker_stage" {
  rest_api_id   = aws_api_gateway_rest_api.job_tracker_api.id
  deployment_id = aws_api_gateway_deployment.job_tracker_deployment.id
  stage_name    = var.environment
}
