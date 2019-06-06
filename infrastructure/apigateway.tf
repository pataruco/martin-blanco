resource "aws_api_gateway_rest_api" "martin_blanco" {
  name        = "Martin Blanco API"
  description = "Martin Blanco API"
}

resource "aws_api_gateway_resource" "dates_resource" {
  rest_api_id = "${aws_api_gateway_rest_api.martin_blanco.id}"
  parent_id   = "${aws_api_gateway_rest_api.martin_blanco.root_resource_id}"
  path_part   = "dates"
}

resource "aws_api_gateway_method" "dates_method" {
  rest_api_id   = "${aws_api_gateway_rest_api.martin_blanco.id}"
  resource_id   = "${aws_api_gateway_resource.dates_resource.id}"
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "dates_lambda" {
  rest_api_id             = "${aws_api_gateway_rest_api.martin_blanco.id}"
  resource_id             = "${aws_api_gateway_resource.dates_resource.id}"
  http_method             = "${aws_api_gateway_method.dates_method.http_method}"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"

  uri = "${aws_lambda_function.dates.invoke_arn}"
}

resource "aws_api_gateway_deployment" "dates_deployment" {
  depends_on = [
    "aws_api_gateway_method.dates_method",
    "aws_api_gateway_integration.dates_lambda",
  ]

  rest_api_id = "${aws_api_gateway_rest_api.martin_blanco.id}"
  stage_name  = "staging"
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.dates.arn}"
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${replace(aws_api_gateway_deployment.dates_deployment.execution_arn, aws_api_gateway_deployment.dates_deployment.stage_name, "")}*/*"
}
