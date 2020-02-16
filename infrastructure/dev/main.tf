provider "google-beta" {
  project = "martin-blanco-api-dev"
  region  = "europe-west2"
  zone    = "europe-west2-a"
}

terraform {
  backend "gcs" {
    bucket = "martin_blanco"
    prefix = "terraform/state"
  }
}


locals {
  dist_path    = "${path.root}/../../dist/"
  project      = "martin-blanco-api-dev"
  zip_filename = "api.zip"
}

# zip up our source code
data "archive_file" "api_zip" {
  type        = "zip"
  source_dir  = local.dist_path
  output_path = "${local.dist_path}${local.zip_filename}"
}

# create the storage bucket
resource "google_storage_bucket" "martin_blanco_bucket" {
  name     = "martin_blanco"
  location = "europe-west2"
  versioning {
    enabled = true
  }
}

# place the zip-ed code in the bucket
resource "google_storage_bucket_object" "api_zip" {
  name   = local.zip_filename
  bucket = google_storage_bucket.martin_blanco_bucket.name
  source = "${local.dist_path}${local.zip_filename}"
}



resource "google_cloudfunctions_function" "api" {
  name                  = "martin-blanco-api"
  description           = "Martin Blanco API"
  project               = local.project
  runtime               = "nodejs10"
  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.martin_blanco_bucket.name
  source_archive_object = google_storage_bucket_object.api_zip.name
  trigger_http          = true
  entry_point           = "app"
  region                = "europe-west2"
}

output "https_trigger_url" {
  value = google_cloudfunctions_function.api.https_trigger_url
}



# IAM entry for all users to invoke the function
resource "google_cloudfunctions_function_iam_member" "invoker" {
  cloud_function = google_cloudfunctions_function.api.name
  member         = "allUsers"
  project        = google_cloudfunctions_function.api.project
  region         = google_cloudfunctions_function.api.region
  role           = "roles/cloudfunctions.invoker"
}
