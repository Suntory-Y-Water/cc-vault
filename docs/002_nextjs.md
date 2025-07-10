# Next.js ベストプラクティス実装ルール

## 1. ルーティングとファイル構造

### ディレクトリ構造例

### 命名規則

- ページコンポーネント: `page.tsx`
- レイアウトコンポーネント: `layout.tsx`
- ローディング状態: `loading.tsx`
- エラーハンドリング: `error.tsx`
- 404 ページ: `not-found.tsx`

## 2. コンポーネント設計

### Server Components

- **デフォルトで Server Components を使用**
- **データフェッチングを含むコンポーネントは Server Components で実装**
- SEO 対応が必要なコンポーネントは Server Components で実装

### Client Components

以下の場合のみ Client Components を使用

- ブラウザ API を使用する場合
- イベントリスナーが必要な場合
- React hooks を使用する場合
- クライアントサイドの状態管理が必要な場合

### 'use client' ディレクティブ

```typescript
"use client";
// クライアントコンポーネントの先頭に記述
```

## 3. API実装

- データフェッチ用のAPIはなるべく作成しないでください。サーバーコンポーネントでのデータフェッチを強く推奨します。
- 作成する場合は事前に許可を要求する。許可を得られなければ基本的にサーバーコンポーネントでのデータフェッチで実装する。

### キャッシュと再検証

- デフォルトでキャッシュを活用
- 適切な再検証戦略を選択:

```typescript
// ISRの場合
fetch(url, { next: { revalidate: 3600 } }); // 1時間ごとに再検証
```

### エラーハンドリング

- APIのアクセスなど、頻繁に例外が発生する箇所にのみ try-catch ブロックを使用して例外を適切に処理
  - その他の処理は例外処理を設定しない

### セキュリティ

- API ルートでは適切な認証・認可チェックを実装
- 入力値のバリデーションを実施、特にサーバーサイドでのバリデーション
- レートリミットの実装を想定する

## 4. パフォーマンス最適化

### 画像最適化

- `next/image`コンポーネントを使用

```typescript
import Image from "next/image";

<Image
  src="/path/to/image.jpg"
  alt="説明"
  width={800}
  height={600}
  priority={true} // 重要な画像の場合
/>;
```

### スクリプト最適化

- `next/script`を使用して外部スクリプトを最適化

```typescript
import Script from "next/script";

<Script src="https://example.com/script.js" strategy="lazyOnload" />;
```

## 5. エラーハンドリング

### エラーバウンダリ

- `error.tsx`ファイルでエラーをキャッチ
- ユーザーフレンドリーなエラーメッセージを表示

### ローディング状態

- `loading.tsx`でローディング状態を管理
- Suspense を使用して細かい粒度でローディングを制御

## 6. 型安全性

### TypeScript

- 厳格な型チェックを有効化

```json
{
  "compilerOptions": {
    "strict": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## 7. セキュリティ

### 環境変数

- 機密情報は`.env`に保存
- 公開する環境変数は`NEXT_PUBLIC_`プレフィックスを使用

### CSP (Content Security Policy)

- 適切な CSP ヘッダーを設定
- `next.config.js`でセキュリティヘッダーを構成