include {
  path = find_in_parent_folders()
}

terraform {
    source = "../..//modules/string-inverter"
}

locals {
  env_name = "prod"
}

inputs = {
   env_name = local.env_name
   bucket = "${local.env_name}-dd-challenge-application-storage"
   key = "words.csv"
   function_name = "${local.env_name}-string-inverter"
}