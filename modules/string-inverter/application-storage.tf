resource "aws_s3_bucket" "application_storage" {
  bucket = "dd-challenge-application-storage"
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
  bucket = "dd-challenge-application-storage"
  key    = "words.csv"
  source = "${path.module}/lambda/string-inverter/words.csv"
  etag = filemd5("${path.module}/lambda/string-inverter/words.csv")

  # ensure that bucket exists before copying file to it
  depends_on = [
    aws_s3_bucket.application_storage
  ]
}