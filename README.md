# frontend-engineer-codecheck

## プロジェクト概要

このリポジトリは、下記、フロントエンドコーディング試験の実装内容

https://github.com/yumemi-inc/frontend-engineer-codecheck

## 実行環境

https://frontend-engineer-codecheck.web.app/

## 技術スタック

- React 19 / TypeScript
- Firebase (Functions, Hosting)
- Vite
- pnpm (workspace)

## 前提条件

- Node.js 22
- pnpm 10
- Docker

## 開発環境構築

- ローカル実行用のシークレットファイルを作成
  - `cp functions/.secret.local.sample functions/.secret.local` して API_KEY を設定する

### Docker を使う場合

- `docker compose up`
- http://localhost:5000 にアクセス

### ローカル実行の場合

- `corepack enable` # pnpm インストール
- `pnpm install --frozen-lockfile`
- `pnpm start`
  - コード変更の適宜適用は watch と組み合わせる

## 開発に利用するコマンド

| コマンド | 説明 |
|---|---|
| `pnpm install --frozen-lockfile` | パッケージインストール（lockfile通りに） |
| `pnpm install` | パッケージ追加・更新時（lockfile更新あり） |
| `pnpm build` | functions, hosting をbuild |
| `pnpm build:watch` | build watch |
| `pnpm lint` | typecheck + ESLint + Prettier |
| `pnpm lint:fix` | ESLint + Prettier 自動修正 |
| `pnpm start` | Dockerを使わずにエミュレーター起動する場合 |

## ディレクトリ構成

  | ディレクトリ | 説明 |
  |---|---|
  | `functions/` | Firebase Functions（API） |
  | `hosting/` | React SPA |

## Functions

Functions URLと、外部APIとの関係

 | エンドポイント | 外部API |
 |---|---|
 | `/api/v1/prefectures` | `/api/v1/prefectures` |
 | `/api/v1/population/:prefCode` | `/api/v1/population/composition/perYear?prefCode=${prefCode}` |

## デプロイ

- main ブランチへのマージ時に GitHub Actions で自動デプロイ

### 初回セットアップ

- `cp infra/terraform.tfvars.example infra/terraform.tfvars` して値を設定
- `terraform -chdir=infra init && terraform -chdir=infra apply`
- API キーを登録
  - `echo -n "api key" | gcloud secrets versions add API_KEY --data-file=- --project=frontend-engineer-codecheck`
- GitHub Secrets に WIF 認証情報を設定
  - `gh secret set WIF_PROVIDER --body "$(terraform -chdir=infra output -raw wif_provider)"`
  - `gh secret set WIF_SERVICE_ACCOUNT --body "$(terraform -chdir=infra output -raw github_actions_service_account_email)"`
