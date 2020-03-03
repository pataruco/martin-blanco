output "https_trigger_url" {
  value = google_cloudfunctions_function.api.https_trigger_url
}


output "api_service_account_public_key" {
  value = google_service_account_key.api_service_account_key.public_key
}
