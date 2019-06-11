provider "aws" {
  region  = "eu-central-1"
  version = "~> 2.12"
}

terraform {
  backend "s3" {
    bucket = "martin-blanco"
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
  description = "Martin Blanco API"
  name        = "Martin Blanco API"
}

data "archive_file" "lambdas_zip" {
  output_path = "lambda.zip"
  source_dir  = "../src/lamdas"
  type        = "zip"
}

resource "aws_iam_role" "lambda_exec" {
  assume_role_policy = "${file("policies/lambda-role.json")}"
  name               = "lamda_execution_role"
}

module "dates" {
  lamda_role             = "${aws_iam_role.lambda_exec.arn}"
  node_version           = "${var.node_version}"
  POD_BUCKET_NAME        = "${var.POD_BUCKET_NAME}"
  rest_api_execution_arn = "${aws_api_gateway_rest_api.martin_blanco.execution_arn}"
  rest_api_id            = "${aws_api_gateway_rest_api.martin_blanco.id}"
  root_id                = "${aws_api_gateway_rest_api.martin_blanco.root_resource_id}"
  source                 = "./routes/dates"
  stage_name             = "${var.stage_name}"
  zip_output_path        = "${data.archive_file.lambdas_zip.output_path}"
}

module "date" {
  rest_api_id = "${aws_api_gateway_rest_api.martin_blanco.id}"
  root_id     = "${aws_api_gateway_rest_api.martin_blanco.root_resource_id}"
  source      = "./routes/date"
}

module "date_id" {
  date_resource_id           = "${module.date.date_resource_id}"
  lamda_role                 = "${aws_iam_role.lambda_exec.arn}"
  node_dependecies_layer_arn = "${aws_lambda_layer_version.node_dependencies.arn}"
  node_version               = "${var.node_version}"
  POD_BUCKET_NAME            = "${var.POD_BUCKET_NAME}"
  rest_api_execution_arn     = "${aws_api_gateway_rest_api.martin_blanco.execution_arn}"
  rest_api_id                = "${aws_api_gateway_rest_api.martin_blanco.id}"
  source                     = "./routes/date/id"
  stage_name                 = "${var.stage_name}"
  zip_output_path            = "${data.archive_file.lambdas_zip.output_path}"
}

module "file" {
  date_id_resource_id        = "${module.date_id.date_id_resource_id}"
  date_id_resource_id        = "${module.date_id.date_id_resource_id}"
  lamda_role                 = "${aws_iam_role.lambda_exec.arn}"
  node_dependecies_layer_arn = "${aws_lambda_layer_version.node_dependencies.arn}"
  node_version               = "${var.node_version}"
  POD_BUCKET_NAME            = "${var.POD_BUCKET_NAME}"
  rest_api_execution_arn     = "${aws_api_gateway_rest_api.martin_blanco.execution_arn}"
  rest_api_execution_arn     = "${aws_api_gateway_rest_api.martin_blanco.execution_arn}"
  rest_api_id                = "${aws_api_gateway_rest_api.martin_blanco.id}"
  source                     = "./routes/date/id/file"
  stage_name                 = "${var.stage_name}"
  zip_output_path            = "${data.archive_file.lambdas_zip.output_path}"
}

module "random" {
  lamda_role             = "${aws_iam_role.lambda_exec.arn}"
  node_version           = "${var.node_version}"
  POD_BUCKET_NAME        = "${var.POD_BUCKET_NAME}"
  rest_api_execution_arn = "${aws_api_gateway_rest_api.martin_blanco.execution_arn}"
  rest_api_id            = "${aws_api_gateway_rest_api.martin_blanco.id}"
  root_id                = "${aws_api_gateway_rest_api.martin_blanco.root_resource_id}"
  source                 = "./routes/random"
  stage_name             = "${var.stage_name}"
  zip_output_path        = "${data.archive_file.lambdas_zip.output_path}"
}

module "updated" {
  lamda_role             = "${aws_iam_role.lambda_exec.arn}"
  node_version           = "${var.node_version}"
  POD_BUCKET_NAME        = "${var.POD_BUCKET_NAME}"
  rest_api_execution_arn = "${aws_api_gateway_rest_api.martin_blanco.execution_arn}"
  rest_api_id            = "${aws_api_gateway_rest_api.martin_blanco.id}"
  root_id                = "${aws_api_gateway_rest_api.martin_blanco.root_resource_id}"
  source                 = "./routes/updated"
  stage_name             = "${var.stage_name}"
  zip_output_path        = "${data.archive_file.lambdas_zip.output_path}"
}
