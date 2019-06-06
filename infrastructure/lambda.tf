data "archive_file" "lambdas_zip" {
  type        = "zip"
  source_dir  = "../src/lamdas"
  output_path = "lambda.zip"
}

resource "aws_lambda_function" "dates" {
  filename         = "${data.archive_file.lambdas_zip.output_path}"
  function_name    = "dates"
  role             = "${aws_iam_role.lambda_exec.arn}"
  handler          = "dates.handler"
  runtime          = "nodejs10.x"
  source_code_hash = "${base64sha256(file("${data.archive_file.lambdas_zip.output_path}"))}"
  publish          = true

  environment {
    variables = {
      POD_BUCKET_NAME = "${var.POD_BUCKET_NAME}"
    }
  }
}

resource "aws_lambda_function" "date" {
  filename         = "${data.archive_file.lambdas_zip.output_path}"
  function_name    = "date"
  role             = "${aws_iam_role.lambda_exec.arn}"
  handler          = "date.handler"
  runtime          = "nodejs10.x"
  source_code_hash = "${base64sha256(file("${data.archive_file.lambdas_zip.output_path}"))}"
  publish          = true
  timeout          = 10

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
