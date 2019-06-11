variable rest_api_id {}
variable root_id {}

resource "aws_api_gateway_resource" "date_resource" {
  rest_api_id = "${var.rest_api_id}"
  parent_id   = "${var.root_id}"
  path_part   = "date"
}
