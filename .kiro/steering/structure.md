# プロジェクト構造

## ルートディレクトリ構成

### 📁 主要ディレクトリ
```
cc-vault/
├── .github/           # GitHub Actions・CI/CD設定
├── .husky/            # Git hooks設定（pre-commit等）
├── .kiro/             # Kiro仕様管理ディレクトリ
│   ├── steering/      # プロジェクトステアリング文書
│   └── specs/         # 機能仕様書
├── .next/             # Next.jsビルド出力（Git除外）
├── .serena/           # Serenaメモリファイル
├── docs/              # プロジェクトドキュメント
├── public/            # 静的ファイル（favicon等）
├── scripts/           # ユーティリティスクリプト
└── src/               # メインソースコード
```

### 🔧 設定ファイル
- `package.json`: 依存関係・スクリプト定義
- `tsconfig.json`: TypeScript設定
- `next.config.ts`: Next.js設定
- `tailwind.config.ts`: Tailwind CSS設定
- `biome.json`: Linter・Formatter設定
- `drizzle.config.ts`: Drizzle ORM設定
- `custom-worker.ts`: Cloudflare Workersカスタム設定
- `open-next.config.ts`: OpenNext.js Cloudflare設定
- `vitest.config.mts`: テスト設定

## src/ ディレクトリ詳細構造

### 🎯 Next.js App Router構成
```
src/app/
├── layout.tsx         # ルートレイアウト（全ページ共通）
├── page.tsx           # ホームページ（記事一覧）
├── not-found.tsx      # 404エラーページ
├── error.tsx          # エラーハンドリングページ
├── robots.ts          # robots.txt動的生成
├── sitemap.ts         # サイトマップ動的生成
├── favicon.ico        # ファビコン
├── features/          # 機能説明ページ
│   └── page.tsx
├── help/              # ヘルプページ
│   └── page.tsx
├── privacy/           # プライバシーポリシー
│   └── page.tsx
├── search/            # 検索機能ページ
│   └── page.tsx
├── terms/             # 利用規約ページ
│   └── page.tsx
└── weekly-report/     # 週次レポートページ
    └── page.tsx
```

### 🧩 Reactコンポーネント構成
```
src/components/
├── ui/                # shadcn/ui ベースコンポーネント
│   ├── badge.tsx      # バッジコンポーネント
│   ├── button.tsx     # ボタンコンポーネント
│   ├── card.tsx       # カードコンポーネント
│   ├── input.tsx      # 入力フィールド
│   └── tabs.tsx       # タブコンポーネント
├── layout/            # レイアウト関連コンポーネント
│   ├── Header.tsx     # ページヘッダー
│   ├── Footer.tsx     # ページフッター
│   ├── MainTabs.tsx   # メインタブナビゲーション
│   └── SiteFilter.tsx # サイトフィルター
├── article/           # 記事表示関連
│   ├── ArticleCard.tsx    # 記事カード
│   ├── ArticleList.tsx    # 記事リスト
│   ├── Pagination.tsx     # ページネーション
│   └── SortControls.tsx   # ソート制御
├── weekly-report/     # 週次レポート関連
│   ├── TopArticles.tsx    # トップ記事表示
│   └── WeekNavigation.tsx # 週選択ナビゲーション
├── search/            # 検索機能関連
│   └── SearchBox.tsx  # 検索ボックス
└── common/            # 共通コンポーネント
    └── StructuredData.tsx # 構造化データ（SEO）
```

### 📚 ライブラリ・ユーティリティ
```
src/lib/
├── utils.ts           # 共通ユーティリティ関数
├── fetchers.ts        # データ取得関数群
├── parser.ts          # HTML解析・記事抽出
├── prompts.ts         # AI プロンプト生成
├── gemini.ts          # Google Gemini API クライアント
├── cloudflare.ts      # Cloudflare D1 データベース操作
├── weekly-report.ts   # 週次レポート生成ロジック
└── constants.ts       # アプリケーション定数
```

### 📝 TypeScript型定義
```
src/types/
├── index.ts           # 共通型エクスポート
├── article.ts         # 記事関連型定義
├── site.ts            # サイト設定型
├── weekly-report.ts   # 週次レポート型
└── next-data.ts       # Next.js データ型
```

### ⚙️ 設定・スキーマ
```
src/config/
├── site.ts            # サイト設定（メタデータ等）
├── ai-agents.ts        # AIエージェント・マルチテナント設定
└── drizzle/           # Drizzle ORM関連
    └── schema.ts      # データベーススキーマ定義
```

### 🧪 テストファイル
```
src/tests/
├── weekly-report.test.ts       # 週次レポート機能テスト
├── ai-agent-config.test.ts     # AIエージェント設定テスト
├── ai-agent-resolver.test.ts   # AIエージェント解決テスト
└── search-tenant-scope.test.ts # テナントスコープ検索テスト
```

## ファイル命名規則

### 📋 コンポーネントファイル
- **Reactコンポーネント**: `PascalCase.tsx` (例: `ArticleCard.tsx`)
- **Pageコンポーネント**: `page.tsx` (Next.js App Router規約)
- **レイアウト**: `layout.tsx` (Next.js App Router規約)

### 🔧 ユーティリティファイル
- **ライブラリ**: `kebab-case.ts` (例: `weekly-report.ts`)
- **型定義**: `kebab-case.ts` (例: `article.ts`)
- **設定ファイル**: `kebab-case.config.ts` (例: `tailwind.config.ts`)

### 📄 特殊ファイル
- **Next.js特殊ファイル**: 規約に従う (`robots.ts`, `sitemap.ts`)
- **テストファイル**: `*.test.ts` / `*.spec.ts`

## インポート構成パターン

### 📦 インポート順序（Biome設定準拠）
1. **外部ライブラリ**: `react`, `next/*`, サードパーティ
2. **内部エイリアス**: `@/*` パス
3. **相対パス**: `./`, `../`

### 🎯 パスエイリアス設定
```typescript
// tsconfig.json
"paths": {
  "@/*": ["./src/*"]
}
```

### 💡 インポート例
```typescript
// 外部ライブラリ
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// 内部コンポーネント
import { ArticleCard } from './ArticleCard'
```

## 主要アーキテクチャパターン

### 🏗️ コンポーネント設計
- **Presentational/Container分離**: UI表示とロジックの分離
- **Custom Hooks**: ステート管理・副作用の抽象化
- **Compound Components**: 複雑なUI構造の組み立て

### 📊 データフロー
- **Server Components**: サーバーサイドデータ取得
- **Client Components**: インタラクティブな機能
- **Drizzle ORM**: 型安全なデータベースアクセス

### 🔄 状態管理
- **React Server Components**: サーバーステート
- **useState/useEffect**: ローカルステート
- **URL State**: 検索・フィルタリング状態

### 🎨 スタイリング
- **Tailwind CSS**: ユーティリティファースト
- **CSS Modules回避**: Tailwindクラス統一
- **Responsive Design**: モバイルファーストアプローチ

### 🏢 マルチテナント・AIエージェント管理
- **設定ベース管理**: `src/config/ai-agents.ts` 静的設定ファイル
- **ホスト名解決**: Next.js `headers()` APIベースのサブドメイン抽出
- **テナント分離**: データベースクエリレベルでの自動フィルタリング
- **セキュリティパターン**: ホスト名検証・サニタイゼーション統一

## コード品質・保守性

### 📏 設計原則
- **Single Responsibility**: 単一責任の原則
- **DRY**: 重複排除（適度な抽象化）
- **YAGNI**: 必要になってから実装
- **契約による設計**: TypeScript型による契約定義
- **テナント分離**: マルチテナント環境でのデータ・セキュリティ境界維持

### 🔍 品質保証
- **型安全性**: TypeScript strict mode
- **コード品質**: Biome linting
- **テスト**: Vitest unit tests
- **Git Hooks**: pre-commit品質チェック