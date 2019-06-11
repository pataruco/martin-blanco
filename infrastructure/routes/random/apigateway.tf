variable rest_api_id {}
variable root_id {}
variable stage_name {}
variable rest_api_execution_arn {}

resource "aws_api_gateway_resource" "random_resource" {
  rest_api_id = "${var.rest_api_id}"
  parent_id   = "${var.root_id}"
  path_part   = "random"
}

resource "aws_api_gateway_method" "random_method" {
  rest_api_id   = "${var.rest_api_id}"
  resource_id   = "${aws_api_gateway_resource.random_resource.id}"
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "random_lamda" {
  rest_api_id             = "${var.rest_api_id}"
  resource_id             = "${aws_api_gateway_resource.random_resource.id}"
  http_method             = "${aws_api_gateway_method.random_method.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.random.invoke_arn}"
}

resource "aws_api_gateway_deployment" "dates_deployment" {
  depends_on = [
    "aws_api_gateway_method.random_method",
    "aws_api_gateway_integration.random_lamda",
  ]

  rest_api_id = "${var.rest_api_id}"
  stage_name  = "${var.stage_name}"
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.random.arn}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.rest_api_execution_arn}/*/*/*"
}
