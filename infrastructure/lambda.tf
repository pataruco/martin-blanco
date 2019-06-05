data "archive_file" "lambdas_zip" {
  type        = "zip"
  source_file = "../src/dates.js"
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
}

resource "aws_iam_role" "lambda_exec" {
  name               = "lamda_execution_role"
  assume_role_policy = "${file("policies/lambda-role.json")}"
}
