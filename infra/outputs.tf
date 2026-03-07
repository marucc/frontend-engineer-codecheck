output "project_id" {
  description = "GCP プロジェクト ID"
  value       = var.project_id
}

output "hosting_site_id" {
  description = "Firebase Hosting サイト ID"
  value       = google_firebase_hosting_site.default.site_id
}

output "hosting_default_url" {
  description = "Firebase Hosting デフォルト URL"
  value       = google_firebase_hosting_site.default.default_url
}

output "functions_service_account_email" {
  description = "Cloud Functions サービスアカウントのメール"
  value       = google_service_account.functions.email
}

output "api_key_secret_id" {
  description = "API キーの Secret ID"
  value       = google_secret_manager_secret.api_key.secret_id
}

output "wif_provider" {
  description = "Workload Identity Provider 名"
  value       = google_iam_workload_identity_pool_provider.github.name
}

output "github_actions_service_account_email" {
  description = "GitHub Actions 用サービスアカウントのメール"
  value       = google_service_account.github_actions.email
}
