variable "date_id_resource_id" {}
variable stage_name {}
variable rest_api_execution_arn {}
variable rest_api_id {}

resource "aws_api_gateway_resource" "file_resource" {
  rest_api_id = "${var.rest_api_id}"
  parent_id   = "${var.date_id_resource_id}"
  path_part   = "{fileId}"
}

resource "aws_api_gateway_method" "file_method" {
  rest_api_id   = "${var.rest_api_id}"
  resource_id   = "${aws_api_gateway_resource.file_resource.id}"
  http_method   = "GET"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.fileId" = true
  }
}

resource "aws_api_gateway_integration" "file_lamda" {
  rest_api_id             = "${var.rest_api_id}"
  resource_id             = "${aws_api_gateway_resource.file_resource.id}"
  http_method             = "${aws_api_gateway_method.file_method.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.file.invoke_arn}"
}

resource "aws_api_gateway_deployment" "file_deployment" {
  depends_on = [
    "aws_api_gateway_method.file_method",
    "aws_api_gateway_integration.file_lamda",
  ]

  rest_api_id = "${var.rest_api_id}"
  stage_name  = "${var.stage_name}"
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.file.arn}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.rest_api_execution_arn}/*/*/*"
}
