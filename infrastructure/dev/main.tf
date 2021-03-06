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
  project      = "martin-blanco-api-dev"
  service_name = "martin-blanco-api"
}

module "storage" {
  bucket_name = local.bucket_name
  project     = local.project
  source      = "../modules/storage"
}

module "cloud-run" {
  bucket_name        = local.bucket_name
  custom_domain_name = "dev.martin-blanco.com"
  digest             = var.DIGEST
  image              = "gcr.io/${local.project}/${local.service_name}"
  project            = local.project
  service_name       = local.service_name
  source             = "../modules/cloud-run"
}

