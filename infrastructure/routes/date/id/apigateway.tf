variable rest_api_id {}
variable date_resource_id {}
variable stage_name {}
variable rest_api_execution_arn {}

resource "aws_api_gateway_resource" "date_id_resource" {
  rest_api_id = "${var.rest_api_id}"
  parent_id   = "${var.date_resource_id}"
  path_part   = "date"
}

resource "aws_api_gateway_method" "date_id_method" {
  rest_api_id   = "${var.rest_api_id}"
  resource_id   = "${aws_api_gateway_resource.date_id_resource.id}"
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "date_lamda" {
  rest_api_id             = "${var.rest_api_id}"
  resource_id             = "${aws_api_gateway_resource.date_id_resource.id}"
  http_method             = "${aws_api_gateway_method.date_id_method.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.date.invoke_arn}"
}

resource "aws_api_gateway_deployment" "date_id_deployment" {
  depends_on = [
    "aws_api_gateway_method.date_id_method",
    "aws_api_gateway_integration.date_lamda",
  ]

  rest_api_id = "${var.rest_api_id}"
  stage_name  = "${var.stage_name}"
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.date.arn}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.rest_api_execution_arn}/*/*/*"
}
