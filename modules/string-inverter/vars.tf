variable "env_name" {
  description = "Tag to identify the environment - e.g. DEV / PROD / QA"
  type        = string
}

variable "bucket" {
  description = "Name of the s3 bucket where the source file is stored and the inversion results will be stored"
  type        = string
}

variable "key" {
  description = "Key (in this case a file name) where the words are stored - e.g. words.csv"
  type        = string
}

variable "function_name" {
  description = "Name of the string-inverter lambda function"
  type        = string
}