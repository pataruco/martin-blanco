
# zip up our source code
data "archive_file" "api_zip" {
  output_path = "${var.dist_path}${var.zip_filename}"
  source_dir  = var.dist_path
  type        = "zip"
}

# create the storage bucket
resource "google_storage_bucket" "martin_blanco_bucket" {
  force_destroy = true
  location      = "europe-west2"
  name          = "martin-blanco"
  project       = var.project
  versioning {
    enabled = true
  }

}

# place the zip-ed code in the bucket
resource "google_storage_bucket_object" "api_zip" {
  bucket = google_storage_bucket.martin_blanco_bucket.name
  name   = var.zip_filename
  source = "${var.dist_path}${var.zip_filename}"
}



resource "google_cloudfunctions_function" "api" {
  available_memory_mb   = 128
  description           = "Martin Blanco API"
  entry_point           = "app"
  name                  = "martin-blanco-api"
  project               = var.project
  region                = "europe-west2"
  runtime               = "nodejs10"
  source_archive_bucket = google_storage_bucket.martin_blanco_bucket.name
  source_archive_object = google_storage_bucket_object.api_zip.name
  trigger_http          = true
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
