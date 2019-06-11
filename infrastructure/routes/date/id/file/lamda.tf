variable lamda_role {}
variable node_version {}
variable POD_BUCKET_NAME {}
variable zip_output_path {}
variable node_dependecies_layer_arn {}

resource "aws_lambda_function" "file" {
  filename         = "${var.zip_output_path}"
  function_name    = "file"
  role             = "${var.lamda_role}"
  handler          = "file.handler"
  runtime          = "${var.node_version}"
  source_code_hash = "${base64sha256(file("${var.zip_output_path}"))}"
  publish          = true
  timeout          = 10
  layers           = ["${var.node_dependecies_layer_arn}"]

  environment {
    variables = {
      POD_BUCKET_NAME = "${var.POD_BUCKET_NAME}"
    }
  }
}
