  
# Derive environment name from folder name
locals {
    env_name = replace(path_relative_to_include(), "environments/", "")
}

inputs = {
    env_name= local.env_name
}

remote_state {
  backend = "s3"
  config = {
    bucket = "dd-challenge"

    key = "envs/${local.env_name}/terraform.tfstate"
    region         = "eu-central-1"
  }
}
