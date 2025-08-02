# CC-Vault アーキテクチャ・パターン

## 全体アーキテクチャ
- **プラットフォーム**: Cloudflare Workers + D1 Database
- **フレームワーク**: Next.js (App Router)
- **ORM**: Drizzle ORM（型安全なデータベース操作）
- **レンダリング**: Server-Side Rendering (SSR)
- **データ取得**: スケジュールタスク + API呼び出し

## デザインパターン

### 1. Repository パターン (Drizzle ORM)
```typescript
// lib/cloudflare.ts
import { drizzle } from 'drizzle-orm/d1';
import { articles } from '@/config/drizzle/schema';

export async function getArticlesWithPagination(params) {
  // Drizzle ORMを使用した型安全なデータベースアクセス
  const db = drizzle(env.DB);
  return await db.select().from(articles)...;
}
```

### 2. Service Layer パターン
```typescript
// lib/fetchers.ts
export async function fetchExternalData<T>(url, options) {
  // 外部API呼び出しの共通化
}
```

### 3. Parser パターン
```typescript
// lib/parser.ts
export function getZennTopicsData({ htmlString }) {
  // HTMLパース処理の分離
}
```

### 4. AI Prompt Generation パターン
```typescript
// lib/prompts.ts
export function generateAIPrompt(content: string) {
  // AI用プロンプト生成の抽象化
}
```

### 5. Migration パターン
```typescript
// scripts/migrate.ts
// データベースマイグレーションの自動化
```

### 6. Component Composition パターン
```typescript
// components/article/ArticleContainer.tsx
// コンポーネントの合成による再利用性向上
```

## データベース設計

### Schema Definition (Drizzle ORM)
```typescript
// src/config/drizzle/schema.ts
export const articles = sqliteTable('articles', {
  id: integer('id').primaryKey().notNull(),
  title: text('title').notNull(),
  url: text('url').notNull().unique(),
  // ...型安全なスキーマ定義
});
```

### Migration System
- **ファイル構成**: src/config/drizzle/migrations/
- **自動生成**: Drizzle Kit による自動マイグレーション
- **実行スクリプト**: scripts/migrate.ts

## コンポーネント設計

### UI Components (components/ui/)
- shadcn/ui ベースの共通UIコンポーネント
- Radix UI + Tailwind CSS
- 再利用可能で一貫したデザイン

### Feature Components (components/article/, components/layout/)
- ドメイン固有のビジネスロジック
- UIコンポーネントを組み合わせて構築

### 状態管理
- サーバーサイドでのデータ取得
- クライアントサイドの状態は最小限
- URL パラメータでの状態管理（ソート、ページネーション）

## データフロー

### 1. データ収集（スケジュール）
```
外部API → Parser → Drizzle ORM → D1 Database
```

### 2. データ表示（リクエスト時）
```
Request → Server Component → Drizzle ORM → D1 Database → Response
```

### 3. マイグレーション
```
Schema Changes → Drizzle Kit → Migration Files → migrate.ts → D1 Database
```

## 運用ツール

### バックアップシステム
```typescript
// scripts/backup-production.ts
// 本番データベースの定期バックアップ
```

### AI統合
```typescript
// lib/prompts.ts
// 記事コンテンツからのAIプロンプト生成
```

## エラーハンドリング
- try-catch による例外処理
- エラー境界（error.tsx）
- 適切なHTTPステータスコード
- Drizzle ORM による型安全性確保

## パフォーマンス最適化
- ISR（Incremental Static Regeneration）
- 画像最適化（Next.js Image）
- CDN活用（Cloudflare）
- データベースインデックス
- Drizzle ORM による最適化されたクエリ