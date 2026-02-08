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

resource "aws_lambda_function" "url_parser" {
  filename         = "backend/url_parser.zip"
  function_name    = "${var.project_name}-url-parser-${var.environment}"
  role            = aws_iam_role.lambda_execution_role.arn
  handler         = "url-parser.handler"
  runtime         = "nodejs18.x"
  timeout         = 60
  source_code_hash = filebase64sha256("backend/url_parser.zip")

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_cloudwatch_log_group.url_parser_logs,
  ]
}

resource "aws_lambda_function" "priority_engine" {
  filename         = "backend/priority_engine.zip"
  function_name    = "${var.project_name}-priority-engine-${var.environment}"
  role            = aws_iam_role.lambda_execution_role.arn
  handler         = "priority-engine.handler"
  runtime         = "nodejs18.x"
  timeout         = 300
  source_code_hash = filebase64sha256("backend/priority_engine.zip")

  environment {
    variables = {
      APPLICATIONS_TABLE = aws_dynamodb_table.job_applications.name
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_cloudwatch_log_group.priority_engine_logs,
  ]
}

resource "aws_cloudwatch_log_group" "url_parser_logs" {
  name              = "/aws/lambda/${var.project_name}-url-parser-${var.environment}"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "priority_engine_logs" {
  name              = "/aws/lambda/${var.project_name}-priority-engine-${var.environment}"
  retention_in_days = 14
}

resource "aws_lambda_function" "isla_chat" {
  filename         = "backend/isla_chat.zip"
  function_name    = "${var.project_name}-isla-chat-${var.environment}"
  role            = aws_iam_role.lambda_execution_role.arn
  handler         = "isla-chat.handler"
  runtime         = "nodejs18.x"
  timeout         = 60
  source_code_hash = filebase64sha256("backend/isla_chat.zip")

  environment {
    variables = {
      TABLE_NAME      = aws_dynamodb_table.job_applications.name
      TAVILY_API_KEY  = var.tavily_api_key
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_cloudwatch_log_group.isla_chat_logs,
  ]
}

resource "aws_cloudwatch_log_group" "isla_chat_logs" {
  name              = "/aws/lambda/${var.project_name}-isla-chat-${var.environment}"
  retention_in_days = 14
}