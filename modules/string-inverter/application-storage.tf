resource "aws_s3_bucket" "application_storage" {
  bucket = var.bucket
  acl = "private"
  versioning {
    enabled = true
  }
  server_side_encryption_configuration {
    rule {
        apply_server_side_encryption_by_default {
          sse_algorithm = "AES256"
        }
    }
  }
}

resource "aws_s3_bucket_object" "object" {
  bucket = var.bucket
  key    = var.key
  source = "${path.module}/lambda/string-inverter/${var.key}"
  etag = filemd5("${path.module}/lambda/string-inverter/${var.key}")

  # ensure that bucket exists before copying file to it
  depends_on = [
    aws_s3_bucket.application_storage
  ]
}