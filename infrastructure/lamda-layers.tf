data "archive_file" "lamda-layers" {
  output_path = "lamda-layers.zip"
  source_dir  = "../src/lamda-layers"
  type        = "zip"
}

resource "aws_lambda_layer_version" "node_dependencies" {
  compatible_runtimes = ["${var.node_version}"]
  description         = "moment joi"
  filename            = "${data.archive_file.lamda-layers.output_path}"
  layer_name          = "node_dependencies"
  source_code_hash    = "${base64sha256(file("${data.archive_file.lamda-layers.output_path}"))}"
}
