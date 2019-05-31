resource "aws_lambda_function" "dates" {
  function_name = "dates"

  # The bucket name as created earlier with "aws s3api create-bucket"
  s3_bucket = "peter-of-the-day-staging"
  s3_key    = "v1.0.0/martin-blanco-api.zip"

  # "main" is the filename within the zip file (main.js) and "handler"
  # is the name of the property under which the handler function was
  # exported in that file.
  handler = "dates.handler"

  runtime = "nodejs10.x"

  role = "${aws_iam_role.lambda_exec.arn}"
}

resource "aws_lambda_function" "date" {
  function_name = "date"

  # The bucket name as created earlier with "aws s3api create-bucket"
  s3_bucket = "peter-of-the-day-staging"
  s3_key    = "v1.0.0/martin-blanco-api.zip"

  # "main" is the filename within the zip file (main.js) and "handler"
  # is the name of the property under which the handler function was
  # exported in that file.
  handler = "date.handler"

  runtime = "nodejs10.x"

  role = "${aws_iam_role.lambda_exec.arn}"
}

# IAM role which dictates what other AWS services the Lambda function
# may access.
resource "aws_iam_role" "lambda_exec" {
  name = "serverless_example_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}
