# コーディング規約

## Biome設定に基づく規約

### フォーマット設定
- **インデント**: スペース2個
- **行幅**: 80文字
- **クォート**: シングルクォート（JavaScript/TypeScript）
- **JSXクォート**: シングルクォート
- **セミコロン**: 必須
- **末尾カンマ**: 全て追加

### リンタールール
- **推奨ルール**: 有効
- **未使用インポート**: 警告
- **未使用変数**: 警告
- **テンプレートリテラル**: 無効（useTemplate: off）
- **import type**: 無効（useImportType: off）
- **Node.jsインポートプロトコル**: 無効
- **forEach禁止**: 無効（noForEach: off）

### TypeScript設定
- **strict**: 有効
- **target**: ES2017
- **module**: esnext
- **moduleResolution**: bundler
- **jsx**: preserve

### テストファイル例外
- テストファイル（`**/*.test.ts`, `**/*.test.tsx`）はlinter対象外
- テスト用ディレクトリでは`noExplicitAny`と`noNonNullAssertion`が無効

### ファイル命名規約
- コンポーネント: PascalCase（例: `UserProfile.tsx`）
- ページ: kebab-case（例: `weekly-report/`）
- 設定ファイル: kebab-case（例: `ai-agents.ts`）
- テストファイル: `*.test.ts` / `*.test.tsx`

### インポート規約
- パスエイリアス`@/`を使用
- 相対パスより絶対パスを優先