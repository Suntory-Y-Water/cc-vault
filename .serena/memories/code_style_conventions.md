# CC-Vault コードスタイル・規約

## コードスタイル設定（Biome）
- **インデント**: スペース 2 文字
- **行幅**: 80 文字
- **クォート**: シングルクォート（JS/TS）、シングルクォート（JSX）
- **セミコロン**: 常に付ける
- **末尾カンマ**: 常に付ける

## TypeScript 設定
- **厳格モード**: 有効
- **target**: ES2017
- **module**: esnext
- **moduleResolution**: bundler
- **型チェック**: 厳格

## パスエイリアス
```typescript
"@/*": ["./src/*"]
```

## リンタールール
- **推奨ルール**: 有効
- **未使用インポート**: 警告
- **未使用変数**: 警告
- **テンプレートリテラル**: オフ
- **import type**: オフ
- **Node.js import protocol**: オフ

## ファイル構成規約
```
src/
├── app/              # Next.js App Router
├── components/       # React コンポーネント
│   ├── ui/          # 共通UIコンポーネント
│   ├── layout/      # レイアウト関連
│   ├── article/     # 記事関連
│   └── common/      # その他共通
├── lib/             # ユーティリティ・ライブラリ
├── types/           # 型定義
└── config/          # 設定ファイル
```

## 命名規約
- **コンポーネント**: PascalCase (`ArticleCard.tsx`)
- **関数**: camelCase (`fetchExternalData`)
- **定数**: UPPER_SNAKE_CASE (`SITE_CONFIGS`)
- **型**: PascalCase (`ArticleRow`)
- **ファイル**: kebab-case またはPascalCase

## Git フック
- **pre-commit**: lint-staged で自動チェック
- **コミット前**: 型チェック、リント実行

## 除外設定
- **Biome**: テストファイル (*.test.ts, *.test.tsx)
- **TypeScript**: node_modules, dist, build, out, coverage