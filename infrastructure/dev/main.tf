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
  bucket_name  = "martin-blanco"
  dist_path    = "${path.root}/../../dist/"
  location     = "europe-west2"
  project      = "martin-blanco-api-dev"
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
  location     = local.location
  project      = local.project
  service_name = local.service_name
  source       = "../modules/cloud-run"
}

