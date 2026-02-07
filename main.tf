terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Backend module
module "backend" {
  source = "./backend"
  
  aws_region   = var.aws_region
  project_name = var.project_name
  environment  = var.environment
}

# Frontend module
module "frontend" {
  source = "./frontend"
  
  aws_region                    = var.aws_region
  project_name                  = var.project_name
  environment                   = var.environment
  api_gateway_url               = module.backend.api_gateway_url
  cognito_user_pool_id          = module.backend.cognito_user_pool_id
  cognito_user_pool_client_id   = module.backend.cognito_user_pool_client_id
  cognito_identity_pool_id      = module.backend.cognito_identity_pool_id
  
  depends_on = [module.backend]
}