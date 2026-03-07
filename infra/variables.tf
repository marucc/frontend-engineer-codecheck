variable "project_id" {
  description = "GCP プロジェクト ID"
  type        = string
}

variable "region" {
  description = "GCP リージョン"
  type        = string
}

variable "github_repo" {
  description = "GitHub リポジトリ（owner/repo 形式）"
  type        = string
}
