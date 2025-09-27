# プロジェクト概要

## プロジェクト名
cc-vault

## プロジェクトの目的
Claude Code Spec-Driven Development - Kiro-style仕様駆動開発の実装。Claude Codeのスラッシュコマンド、フック、エージェントを使用したNext.jsベースのWebアプリケーション。

## 主要な機能
- AIエージェント用マルチテナント・サブドメインルーティングシステム
- サブドメインテーマシステム
- 検索機能
- ウィークリーレポート機能
- ヘルプ、プライバシー、利用規約ページ

## デプロイメント環境
- Cloudflare Pages/Workers
- Next.js 15.5.0アプリケーション
- D1データベース（SQLite）
- OpenNext.js Cloudflareアダプター使用

## プロジェクト構造の特徴
- Kiro仕様駆動開発ワークフロー（.kiro/ディレクトリ）
- Claude Code統合（.claude/ディレクトリ）
- TypeScript + Next.js App Router
- Tailwind CSS + shadcn/ui