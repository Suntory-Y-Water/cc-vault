# CC-Vault アーキテクチャ・パターン

## 全体アーキテクチャ
- **プラットフォーム**: Cloudflare Workers + D1 Database
- **フレームワーク**: Next.js (App Router)
- **レンダリング**: Server-Side Rendering (SSR)
- **データ取得**: スケジュールタスク + API呼び出し

## デザインパターン

### 1. Repository パターン
```typescript
// lib/cloudflare.ts
export async function getArticlesWithPagination(params) {
  // データベースアクセスの抽象化
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

### 4. Component Composition パターン
```typescript
// components/article/ArticleContainer.tsx
// コンポーネントの合成による再利用性向上
```

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
外部API → Parser → D1 Database
```

### 2. データ表示（リクエスト時）
```
Request → Server Component → D1 Database → Response
```

## エラーハンドリング
- try-catch による例外処理
- エラー境界（error.tsx）
- 適切なHTTPステータスコード

## パフォーマンス最適化
- ISR（Incremental Static Regeneration）
- 画像最適化（Next.js Image）
- CDN活用（Cloudflare）
- データベースインデックス