provider "aws" {
  region = "eu-central-1"
}

terraform {
  backend "s3" {
    bucket = "dd-challenge"
    key    = "state"
    region = "eu-central-1"
  }
}

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