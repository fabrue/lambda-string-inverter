resource "aws_iam_role" "lambda_execution" {
  name = "${var.function_name}-execution-role"

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

inline_policy {
    name = "${var.function_name}-policy"

    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Action   = [
            "s3:PutObject",
            "s3:GetObject"
          ]
          Effect   = "Allow"
          Resource = "arn:aws:s3:::${var.bucket}/*"
        },
        {
          "Action": [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
          ],
          "Resource": "arn:aws:logs:eu-central-1:694928554219:log-group:/aws/lambda/${var.function_name}:*",
          "Effect": "Allow"
        }
      ]
    })
  }
}