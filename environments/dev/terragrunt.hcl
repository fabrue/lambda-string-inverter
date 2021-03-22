include {
  path = find_in_parent_folders()
}

terraform {
    source = "../..//modules/string-inverter"
}

inputs = {
   env_name = "DEV"
}