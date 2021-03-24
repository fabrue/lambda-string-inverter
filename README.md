# String Inverter Application on AWS with Terragrunt
## Overview
This repo shows an example on how to deploy AWS infrastructure components using [Terragrunt](https://terragrunt.gruntwork.io/).

The application itself is stored in the `modules/string-inverter` subfolder. It accepts a list of words as comma separated values, inverts each word and then returns a new timestamped csv-file containing the results. The used components are shown in the diagram below:

![new-architecture-diagram](https://user-images.githubusercontent.com/13106029/112223315-05dfcc00-8c2a-11eb-8f70-3d8d57c92f31.png)

To provide an easy possibility to deploy the app into different environments (e.g. PROD/DEV/QA/UNAMEIT) this example uses Terragrunt. Each environment has its own folder. Take a look at the `environments/*` subfolder for more details.

To deploy all environments run `terragrunt run-all apply` in the root folder. To deploy a single environment run `terragrunt run-all validate --terragrunt-working-dir ./environments/dev` .


## Resources
- https://aws.amazon.com/blogs/aws/s3-glacier-select/
- https://terragrunt.gruntwork.io/docs/reference/cli-options/