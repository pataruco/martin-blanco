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

variable "POD_BUCKET_NAME" {}

variable "node_version" {
  default = "nodejs10.x"
}

variable "stage_name" {
  default = "api"
}

resource "aws_api_gateway_rest_api" "martin_blanco" {
  name        = "Martin Blanco API"
  description = "Martin Blanco API"
}

data "archive_file" "lambdas_zip" {
  type        = "zip"
  source_dir  = "../src/lamdas"
  output_path = "lambda.zip"
}

resource "aws_lambda_function" "date" {
  filename         = "${data.archive_file.lambdas_zip.output_path}"
  function_name    = "date"
  role             = "${aws_iam_role.lambda_exec.arn}"
  handler          = "date.handler"
  runtime          = "${var.node_version}"
  source_code_hash = "${base64sha256(file("${data.archive_file.lambdas_zip.output_path}"))}"
  publish          = true
  timeout          = 10
  layers           = ["${aws_lambda_layer_version.node_dependencies.arn}"]

  environment {
    variables = {
      POD_BUCKET_NAME = "${var.POD_BUCKET_NAME}"
    }
  }
}

resource "aws_iam_role" "lambda_exec" {
  name               = "lamda_execution_role"
  assume_role_policy = "${file("policies/lambda-role.json")}"
}

module "dates" {
  source                 = "./routes/dates"
  rest_api_id            = "${aws_api_gateway_rest_api.martin_blanco.id}"
  root_id                = "${aws_api_gateway_rest_api.martin_blanco.root_resource_id}"
  stage_name             = "${var.stage_name}"
  lamda_role             = "${aws_iam_role.lambda_exec.arn}"
  node_version           = "${var.node_version}"
  POD_BUCKET_NAME        = "${var.POD_BUCKET_NAME}"
  zip_output_path        = "${data.archive_file.lambdas_zip.output_path}"
  rest_api_execution_arn = "${aws_api_gateway_rest_api.martin_blanco.execution_arn}"
}
