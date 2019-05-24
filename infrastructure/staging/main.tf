provider "aws" {
  version = "~> 2.12"
}

terraform {
  backend "s3" {
    bucket = "peter-of-the-day-staging"
    key    = "terraform"
  }
}
