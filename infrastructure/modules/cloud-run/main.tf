resource "google_cloud_run_service" "martin_blanco_api" {
  name     = var.service_name
  location = "europe-west1" # It is different from main location because on europe-west2 Cloud Run is no available
  project  = var.project

  template {
    spec {
      containers {
        image = "${var.image}@${var.digest}"
        env {
          name  = "BUCKET_NAME"
          value = var.bucket_name
        }
      }
    }
  }

  traffic {
    latest_revision = true
    percent         = 100
  }
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.martin_blanco_api.location
  project  = google_cloud_run_service.martin_blanco_api.project
  service  = google_cloud_run_service.martin_blanco_api.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
