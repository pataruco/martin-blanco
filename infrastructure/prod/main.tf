provider "google-beta" {
  project = "martin-blanco-api-prod"
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
  project      = "martin-blanco-api-prod"
  zip_filename = "api.zip"
  bucket_name  = "martin-blanco-api"
}

module "cloud-function" {
  bucket_name  = local.bucket_name
  dist_path    = local.dist_path
  project      = local.project
  source       = "../modules/cloud-function"
  zip_filename = local.zip_filename
}
