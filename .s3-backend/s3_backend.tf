terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

resource "aws_s3_bucket" "state" {
  bucket = "dd-challenge"
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