data "archive_file" "zip_string_inverter_lambda" {
  type        = "zip"
  source_file = "${path.module}/lambda/string-inverter/string-inverter.js"
  output_path = "${path.module}/lambda/string-inverter/string-inverter.zip"
}

resource "aws_lambda_function" "string_inverter" {
  filename         = data.archive_file.zip_string_inverter_lambda.output_path
  source_code_hash = data.archive_file.zip_string_inverter_lambda.output_base64sha256
  role          = aws_iam_role.lambda_execution.arn
  handler       = "string-inverter.handler"
  function_name = "string-inverter"
  runtime = "nodejs14.x"

  environment {
    variables = {
      "bucketname" = "dd-challenge-application-storage"
      "key" = "words.csv"
    }
  }
}

resource "aws_cloudwatch_log_group" "string_inverter_logs" {
  name = "/aws/lambda/string-inverter"
}