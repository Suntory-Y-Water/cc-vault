# CC-Vault コードベース構造

## ディレクトリ構成
```
cc-vault/
├── .github/          # GitHub Actions設定
├── .husky/           # Git hooks設定
├── .serena/          # Serena設定
├── scripts/          # ユーティリティスクリプト
├── public/           # 静的ファイル
├── src/              # ソースコード
└── docs/             # ドキュメント
```

## src/ ディレクトリ詳細
```
src/
├── app/              # Next.js App Router
│   ├── page.tsx      # ホームページ
│   ├── layout.tsx    # ルートレイアウト
│   ├── not-found.tsx # 404ページ
│   ├── error.tsx     # エラーページ
│   ├── robots.ts     # robots.txt
│   ├── sitemap.ts    # サイトマップ
│   ├── features/     # 機能ページ
│   ├── help/         # ヘルプページ
│   ├── privacy/      # プライバシーポリシー
│   └── terms/        # 利用規約
├── components/       # Reactコンポーネント
│   ├── ui/           # shadcn/ui コンポーネント
│   ├── layout/       # レイアウト関連
│   ├── article/      # 記事関連
│   └── common/       # 共通コンポーネント
├── lib/              # ユーティリティライブラリ
│   ├── utils.ts      # 共通ユーティリティ
│   ├── fetchers.ts   # データ取得関数
│   ├── parser.ts     # HTMLパース関数
│   ├── prompts.ts    # AIプロンプト生成関数
│   ├── cloudflare.ts # Cloudflare D1関連（Drizzle ORM使用）
│   └── constants.ts  # 定数定義
├── types/            # TypeScript型定義
│   ├── article.ts    # 記事関連型
│   ├── api.ts        # API関連型
│   ├── site.ts       # サイト設定型
│   └── next-data.ts  # Next.jsデータ型
├── config/           # 設定ファイル
│   ├── site.ts       # サイト設定
│   └── drizzle/      # Drizzle ORM設定
│       ├── schema.ts # データベーススキーマ定義
│       └── migrations/ # マイグレーションファイル
└── scripts/          # ユーティリティスクリプト
    ├── migrate.ts    # マイグレーション実行スクリプト
    └── backup-production.ts # 本番データバックアップスクリプト
```

## 主要ファイル
- **custom-worker.ts**: Cloudflare Workers設定・スケジュールタスク
- **wrangler.jsonc**: Cloudflare Workers設定
- **drizzle.config.ts**: Drizzle ORM設定
- **next.config.ts**: Next.js設定
- **biome.json**: Biome設定
- **package.json**: 依存関係・スクリプト
- **tsconfig.json**: TypeScript設定

## データベース
- **D1 Database**: Cloudflare D1（SQLiteベース）
- **ORM**: Drizzle ORM（型安全なクエリ）
- **テーブル**: articles（記事データ）
- **マイグレーション**: src/config/drizzle/migrations/ で管理
- **スキーマ**: src/config/drizzle/schema.ts で定義

## 設定ファイル
- **biome.json**: リンター・フォーマッター
- **tailwind.config.ts**: Tailwind CSS
- **vitest.config.mts**: テスト設定
- **postcss.config.mjs**: PostCSS設定
- **drizzle.config.ts**: Drizzle ORM設定