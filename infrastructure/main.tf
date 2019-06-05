provider "aws" {
  version = "~> 2.12"
  region  = "eu-central-1"
}

terraform {
  backend "s3" {
    bucket = "peter-of-the-day-staging"
    key    = "terraform"
  }
}

data "aws_region" "current" {}

data "aws_caller_identity" "current" {}
