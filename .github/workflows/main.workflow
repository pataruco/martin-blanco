# main.workflow

workflow "Deploy to cloud function" {
  on = "push"
  resolves = ["Deploy to Google Cloud"]
}

# install with yarn
action "Install" {
  uses = "actions/npm@1.0.0"
  runs = "yarn"
  args = "install"
}

# build with yarn
action "Build" {
  needs = "Install"
  uses = "actions/npm@1.0.0"
  runs = "yarn"
  args = "build"
}

action "Setup Google Cloud" {
  uses = "actions/gcloud/auth@master"
  secrets = ["GCLOUD_AUTH"]
}

# Deploy Filter, only deploy on master branch
action "Deploy branch filter" {
  needs = ["Build", "Setup Google Cloud"]
  uses = "actions/bin/filter@master"
  args = "branch master"
}

# Deploy
action "Deploy to Google Cloud" {
  uses = "actions/gcloud/cli@master"
  needs = ["Deploy branch filter"]
  runs = "sh -c"
  args = ["gcloud functions deploy $CLOUD_FUNCTION --region=europe-west1 --source=. --trigger-http --project $CLOUD_PROJECT"]
  secrets = ["GCLOUD_AUTH"]
  env = {
    CLOUD_FUNCTION = <NAME_OF_YOUR_FUNCTION>
    CLOUD_PROJECT = <GCLOUD_PROJECT_NAME>
  }
}
