variable lamda_role {}
variable node_version {}
variable POD_BUCKET_NAME {}
variable zip_output_path {}

resource "aws_lambda_function" "dates" {
  filename         = "${var.zip_output_path}"
  function_name    = "dates"
  role             = "${var.lamda_role}"
  handler          = "dates.handler"
  runtime          = "${var.node_version}"
  source_code_hash = "${base64sha256(file("${var.zip_output_path}"))}"
  publish          = true

  environment {
    variables = {
      POD_BUCKET_NAME = "${var.POD_BUCKET_NAME}"
    }
  }
}
