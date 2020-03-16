provider "google-beta" {
  project = "martin-blanco-api-prod"
  region  = "europe-west2"
  zone    = "europe-west2-a"
}

terraform {
  backend "gcs" {
    bucket = "martin-blanco-prod"
    prefix = "terraform/state"
  }
}


locals {
  bucket_name  = "martin-blanco-api"
  dist_path    = "${path.root}/../../dist/"
  project      = "martin-blanco-api-prod"
  zip_filename = "api.zip"
  service_name = "martin-blanco-api"
}

module "cloud-function" {
  bucket_name  = local.bucket_name
  dist_path    = local.dist_path
  project      = local.project
  source       = "../modules/cloud-function"
  zip_filename = local.zip_filename
}

module "cloud-run" {
  bucket_name  = local.bucket_name
  digest       = var.DIGEST
  image        = "gcr.io/${local.project}/${local.service_name}"
  project      = local.project
  service_name = local.service_name
  source       = "../modules/cloud-run"
}
