variable "image" {
  description = "Name of the docker image to deploy."
}

variable "digest" {
  description = "The docker image digest to deploy."
}

variable "project" {
  description = "Project name"
}

variable "bucket_name" {
  description = "Storage bucket name"
}

variable "service_name" {
  description = "Cloud Run service name"
}
