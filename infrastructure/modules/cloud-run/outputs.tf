output "cloud_run_status" {
  value = google_cloud_run_service.martin_blanco_api.status
}

output "cloud_run_custom_domain_status" {
  value = google_cloud_run_domain_mapping.custom_domain.status
}
