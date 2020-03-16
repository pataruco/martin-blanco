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

