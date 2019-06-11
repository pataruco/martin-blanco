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

module "date" {
  source      = "./routes/date"
  rest_api_id = "${aws_api_gateway_rest_api.martin_blanco.id}"
  root_id     = "${aws_api_gateway_rest_api.martin_blanco.root_resource_id}"
}

module "date_id" {
  source                     = "./routes/date/id"
  lamda_role                 = "${aws_iam_role.lambda_exec.arn}"
  node_version               = "${var.node_version}"
  POD_BUCKET_NAME            = "${var.POD_BUCKET_NAME}"
  zip_output_path            = "${data.archive_file.lambdas_zip.output_path}"
  node_dependecies_layer_arn = "${aws_lambda_layer_version.node_dependencies.arn}"
  date_resource_id           = "${module.date.date_resource_id}"
  stage_name                 = "${var.stage_name}"
  rest_api_execution_arn     = "${aws_api_gateway_rest_api.martin_blanco.execution_arn}"
  rest_api_id                = "${aws_api_gateway_rest_api.martin_blanco.id}"
}
