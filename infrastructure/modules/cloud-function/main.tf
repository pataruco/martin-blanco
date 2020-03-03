
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
  name          = var.bucket_name
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


# Service Account
resource "google_service_account" "api_service_account" {
  account_id   = "api-service-account"
  display_name = "api-service-account"
  project      = var.project
  description  = "Enable cloud function to call storage"

}

resource "google_service_account_key" "api_service_account_key" {
  service_account_id = google_service_account.api_service_account.name
}

resource "google_project_iam_custom_role" "api_service_account_roles" {
  role_id     = "api_service_account"
  title       = "api_service_account"
  description = "Cloud function service account roles"
  project     = var.project
  permissions = [
    "cloudfunctions.functions.call",
    "cloudfunctions.functions.create",
    "cloudfunctions.functions.delete",
    "cloudfunctions.functions.get",
    "cloudfunctions.functions.invoke",
    "cloudfunctions.functions.list",
    "cloudfunctions.functions.sourceCodeGet",
    "cloudfunctions.functions.sourceCodeSet",
    "cloudfunctions.functions.update",
    "cloudfunctions.locations.list",
    "cloudfunctions.operations.get",
    "cloudfunctions.operations.list",
    "storage.buckets.create",
    "storage.buckets.delete",
    "storage.buckets.get",
    "storage.buckets.list",
    "storage.buckets.update",
    "storage.objects.create",
    "storage.objects.delete",
    "storage.objects.get",
    "storage.objects.list",
    "storage.objects.update",
  ]
}

resource "google_project_iam_binding" "api_service_account_roles_binding" {
  role    = "projects/${var.project}/roles/${google_project_iam_custom_role.api_service_account_roles.role_id}"
  project = var.project
  members = [
    "serviceAccount:${google_service_account.api_service_account.email}",
  ]
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

# IAM entry for all users to invoke the function
resource "google_cloudfunctions_function_iam_member" "invoker" {
  cloud_function = google_cloudfunctions_function.api.name
  member         = "allUsers"
  project        = google_cloudfunctions_function.api.project
  region         = google_cloudfunctions_function.api.region
  role           = "roles/cloudfunctions.invoker"
}

resource "google_cloudfunctions_function_iam_member" "service_account_storage" {
  cloud_function = google_cloudfunctions_function.api.name
  member         = "serviceAccount:${google_service_account.api_service_account.email}"
  project        = google_cloudfunctions_function.api.project
  region         = google_cloudfunctions_function.api.region
  role           = google_project_iam_binding.api_service_account_roles_binding.role
}
