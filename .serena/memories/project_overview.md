# CC-Vault プロジェクト概要

## プロジェクトの目的
Claude Code に特化した情報提供プラットフォーム。複数の記事プラットフォーム（Qiita、Zenn、はてなブックマーク）から Claude Code 関連記事を収集・分析し、トレンドや人気記事をキュレーションして提供する Web アプリケーション。

## 技術スタック
- **フレームワーク**: Next.js 15.3.0 (App Router)
- **言語**: TypeScript 5.8.3
- **UI**: React 19.1.0, Tailwind CSS, Radix UI
- **デプロイ**: Cloudflare Workers + D1 Database
- **データベース**: Cloudflare D1 (SQLite ベース) + **Drizzle ORM**
- **パッケージマネージャー**: pnpm
- **テスト**: Vitest
- **リンター/フォーマッター**: Biome
- **Git フック**: Husky

## 主要機能
- 記事の自動収集（スケジュール実行）
- 記事の表示・ソート・ページネーション
- サイト別フィルタリング
- レスポンシブデザイン
- SEO 対応（構造化データ、sitemap など）

## アーキテクチャ
- Cloudflare Workers で Next.js アプリを実行
- スケジュールタスクで記事データを定期収集
- **Drizzle ORM を使用した型安全なデータベース操作**
- D1 データベースに記事データを保存
- サーバーサイドレンダリング対応