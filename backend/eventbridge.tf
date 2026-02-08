resource "aws_cloudwatch_event_rule" "daily_priority_update" {
  name                = "${var.project_name}-daily-priority-${var.environment}"
  description         = "Trigger priority engine daily"
  schedule_expression = "cron(0 9 * * ? *)"
}

resource "aws_cloudwatch_event_target" "priority_engine" {
  rule      = aws_cloudwatch_event_rule.daily_priority_update.name
  target_id = "PriorityEngineLambda"
  arn       = aws_lambda_function.priority_engine.arn
}

resource "aws_lambda_permission" "allow_eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.priority_engine.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.daily_priority_update.arn
}
