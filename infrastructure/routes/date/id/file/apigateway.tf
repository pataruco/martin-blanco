variable "date_id_resource_id" {}
variable stage_name {}
variable rest_api_execution_arn {}
variable rest_api_id {}

resource "aws_api_gateway_resource" "file_resource" {
  rest_api_id = "${var.rest_api_id}"
  parent_id   = "${var.date_id_resource_id}"
  path_part   = "{fileId}"
}
