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