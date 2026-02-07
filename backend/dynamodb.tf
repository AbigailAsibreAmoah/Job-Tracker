resource "aws_dynamodb_table" "job_applications" {
  name           = "${var.project_name}-applications-${var.environment}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "user_id"
  range_key      = "application_id"

  attribute {
    name = "user_id"
    type = "S"
  }

  attribute {
    name = "application_id"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  global_secondary_index {
    name     = "StatusIndex"
    hash_key = "user_id"
    range_key = "status"
    projection_type = "ALL"
  }

  tags = {
    Name        = "${var.project_name}-applications"
    Environment = var.environment
  }
}

resource "aws_dynamodb_table" "user_profiles" {
  name         = "${var.project_name}-users-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "user_id"

  attribute {
    name = "user_id"
    type = "S"
  }

  tags = {
    Name        = "${var.project_name}-users"
    Environment = var.environment
  }
}