# Create the service account. Replace [NAME] with a name for the service account.

gcloud iam service-accounts create terraform-service-account

# Grant permissions to the service account. Replace martin-blanco-api-dev with your project ID.

gcloud projects add-iam-policy-binding martin-blanco-api-dev --member "serviceAccount:terraform-service-account@martin-blanco-api-dev.iam.gserviceaccount.com" --role "roles/owner"

# Generate the key file. Replace [FILE_NAME] with a name for the key file.

gcloud iam service-accounts keys create /Users/pataruco/creds/martin-blanco-api-dev.json --iam-account terraform-service-account@martin-blanco-api-dev.iam.gserviceaccount.com
