provider "google-beta" {
  project = "martin-blanco-api-dev"
  region  = "europe-west2"
  zone    = "europe-west2-a"
}

terraform {
  backend "gcs" {
    bucket = "martin-blanco-dev"
    prefix = "terraform/state"
  }
}


locals {
  dist_path    = "${path.root}/../../dist/"
  project      = "martin-blanco-api-dev"
  zip_filename = "api.zip"
}

module "cloud-function" {
  source       = "../modules/cloud-function"
  dist_path    = local.dist_path
  project      = local.project
  zip_filename = local.zip_filename
}
