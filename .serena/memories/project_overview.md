# プロジェクト概要

## プロジェクト名
cc-vault

## プロジェクトの目的
技術記事のキュレーションと分析を行うWebアプリケーション。Zenn、Qiita、Hatena BookmarkなどのWebサイトから技術記事を収集・分析し、ユーザーに価値のある情報を提供する。

## 主な機能
- 記事の収集・分析・表示
- 週次レポートの生成
- AI（Gemini）を使った記事要約とレポート作成
- ページネーション、ソート、フィルタリング機能
- レスポンシブデザイン（Tailwind CSS）

## 技術スタック
### フロントエンド
- **フレームワーク**: Next.js 15.3.0 (App Router)
- **言語**: TypeScript (ES2017)
- **UI**: React 19.1.0, Radix UI, Tailwind CSS
- **スタイリング**: Tailwind CSS, class-variance-authority

### バックエンド
- **ランタイム**: Cloudflare Workers (OpenNext.js Cloudflare)
- **データベース**: ローカル→LibSQL（Turso）、本番→Cloudflare D1
- **ORM**: Drizzle ORM
- **AI**: Google Gemini API

### 開発ツール
- **リンター/フォーマッター**: Biome
- **テスト**: Vitest, Testing Library, Happy DOM
- **型チェック**: TypeScript
- **Git Hooks**: Husky, lint-staged
- **デプロイ**: Cloudflare Workers

## プロジェクト構造
```
src/
├── app/          # Next.js App Router ページ
├── components/   # Reactコンポーネント
├── lib/          # ビジネスロジック・ユーティリティ
├── types/        # TypeScript型定義
└── config/       # 設定ファイル・データベーススキーマ
```

## 開発・デプロイ環境
- **プラットフォーム**: Cloudflare Workers
- **Node.jsバージョン**: ES2017対応
- **パッケージマネージャー**: pnpm