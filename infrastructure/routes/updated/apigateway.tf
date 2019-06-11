variable rest_api_id {}
variable root_id {}
variable stage_name {}
variable rest_api_execution_arn {}

resource "aws_api_gateway_resource" "updated_resource" {
  rest_api_id = "${var.rest_api_id}"
  parent_id   = "${var.root_id}"
  path_part   = "updated"
}

resource "aws_api_gateway_method" "updated_method" {
  rest_api_id   = "${var.rest_api_id}"
  resource_id   = "${aws_api_gateway_resource.updated_resource.id}"
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "updated_lamda" {
  rest_api_id             = "${var.rest_api_id}"
  resource_id             = "${aws_api_gateway_resource.updated_resource.id}"
  http_method             = "${aws_api_gateway_method.updated_method.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.updated.invoke_arn}"
}

resource "aws_api_gateway_deployment" "updated_deployment" {
  depends_on = [
    "aws_api_gateway_method.updated_method",
    "aws_api_gateway_integration.updated_lamda",
  ]

  rest_api_id = "${var.rest_api_id}"
  stage_name  = "${var.stage_name}"
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.updated.arn}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.rest_api_execution_arn}/*/*/*"
}
