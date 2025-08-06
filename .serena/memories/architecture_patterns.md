# アーキテクチャ・設計パターン

## アプリケーション構造

### Next.js App Router パターン
- **サーバーコンポーネント**: デフォルトでサーバー側実行
- **クライアントコンポーネント**: `'use client'`で明示
- **データ取得**: Server Actionsまたはサーバーコンポーネントで実行

### レイヤー構造
```
UI Layer (components/) 
    ↓
Business Logic (lib/)
    ↓  
Data Layer (config/drizzle/)
    ↓
External APIs (Gemini, Web APIs)
```

## コンポーネント設計パターン

### コンポーネント分類
1. **UI Components** (`components/ui/`)
   - 汎用的な基本コンポーネント
   - Radix UIベースで構築

2. **Feature Components** (`components/article/`, `components/weekly-report/`)
   - ドメイン固有のビジネスロジック含有
   - データ表示・操作機能

3. **Layout Components** (`components/layout/`)
   - アプリケーション全体のレイアウト
   - ナビゲーション、ヘッダー、フッター

4. **Common Components** (`components/common/`)
   - 複数機能で共有される汎用コンポーネント

### 関数ベース設計
- **クラス禁止**: 全て関数コンポーネント・関数で実装
- **単一責任**: 1つの関数は1つの明確な責任
- **早期リターン**: 可読性向上のため積極使用

## データフロー

### 記事収集・分析フロー
```
外部API → Fetchers → Parser → DB保存 → UI表示
```

### 週次レポート生成フロー
```
DB記事データ → Gemini AI → レポート生成 → DB保存 → UI表示
```

## 状態管理パターン

### Server State
- Next.js Server Componentsでデータ取得
- Cloudflare D1/Tursoデータベースから直接取得

### Client State  
- React hooksでローカル状態管理
- プロップスドリリングまたはContext使用

## 型設計パターン

### 型の組織化
- `src/types/index.ts`で集約エクスポート
- ドメインごとに型定義ファイル分割
- Pick・Omitユーティリティ型積極使用

### API型定義
```typescript
// レスポンス型
type ApiResponse<T> = {
  data: T;
  error?: string;
  status: number;
};

// リクエスト型
type PaginationParams = {
  page: number;
  limit: number;
};
```

## エラーハンドリングパターン

### 階層化エラーハンドリング
1. **API層**: HTTPエラー・ネットワークエラー
2. **ビジネスロジック層**: バリデーションエラー・データ変換エラー
3. **UI層**: ユーザー向けエラー表示

### エラーバウンダリ
- Next.js `error.tsx`でページレベルエラーキャッチ
- React Error Boundaryでコンポーネントレベルエラーキャッチ

## パフォーマンス最適化

### Next.js最適化
- `revalidate`によるISR（Incremental Static Regeneration）
- 動的インポートでコード分割
- 画像最適化（Next.js Image）

### Cloudflare Workers最適化
- エッジでの実行によるレイテンシ削減
- D1データベースでの高速データアクセス