resource "aws_lambda_function" "job_applications_api" {
  filename         = "backend/job_applications.zip"
  function_name    = "${var.project_name}-applications-api-${var.environment}"
  role            = aws_iam_role.lambda_execution_role.arn
  handler         = "job-applications.handler"
  runtime         = "nodejs18.x"
  timeout         = 30
  source_code_hash = filebase64sha256("backend/job_applications.zip")

  environment {
    variables = {
      APPLICATIONS_TABLE = aws_dynamodb_table.job_applications.name
      USERS_TABLE       = aws_dynamodb_table.user_profiles.name
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_cloudwatch_log_group.lambda_logs,
  ]
}

resource "aws_lambda_function" "analytics_api" {
  filename         = "backend/analytics.zip"
  function_name    = "${var.project_name}-analytics-api-${var.environment}"
  role            = aws_iam_role.lambda_execution_role.arn
  handler         = "analytics.handler"
  runtime         = "nodejs18.x"
  timeout         = 30
  source_code_hash = filebase64sha256("backend/analytics.zip")

  environment {
    variables = {
      APPLICATIONS_TABLE = aws_dynamodb_table.job_applications.name
      USERS_TABLE        = aws_dynamodb_table.user_profiles.name
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_cloudwatch_log_group.analytics_logs,
  ]
}

resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${var.project_name}-applications-api-${var.environment}"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "analytics_logs" {
  name              = "/aws/lambda/${var.project_name}-analytics-api-${var.environment}"
  retention_in_days = 14
}