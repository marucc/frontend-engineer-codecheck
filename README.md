# frontend-engineer-codecheck

## プロジェクト概要

このリポジトリは、下記、フロントエンドコーディング試験の実装内容

https://github.com/yumemi-inc/frontend-engineer-codecheck

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

### Docker を使う場合

- `docker compose up`
- http://localhost:5000 にアクセス

### ローカル実行の場合

- `corepack enable` # pnpm インストール
- `pnpm install --frozen-lockfile`
- `pnpm start`
  - コード変更の適宜適用は watch と組み合わせる

## 開発に利用するコマンド

- `pnpm install --frozen-lockfile` パッケージインストール（lockfile通りに）
- `pnpm install` パッケージ追加・更新時（lockfile更新あり）
- `pnpm build` functions, hosting をbuild
- `pnpm build:watch` build watch
- `pnpm lint` typecheck + ESLint + Prettier
- `pnpm lint:fix` ESLint + Prettier 自動修正
- `pnpm start` Dockerを使わずにエミュレーター起動する場合

## ディレクトリ構成

- `functions` Firebase Functions（API）
- `hosting` React SPA


## Functions

Functions URLと、外部APIとの関係

 | エンドポイント | 外部API |
 |---|---|
 | `/api/v1/prefectures` | `/api/v1/prefectures` |
 | `/api/v1/population/:prefCode` | `/api/v1/population/composition/perYear?prefCode=${prefCode}` |
