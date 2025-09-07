# 契約による設計とAI駆動開発ガイド

このドキュメントでは、AI駆動開発において契約による設計がテストコードよりも本質的である理由と、実際のプロジェクトでの活用方法を説明します。

## 概要

契約による設計(Contract-Driven Design)は、関数やモジュール間の責任を明確にし、インターフェイスに対する要件を事前定義する設計手法です。
AI駆動開発では、人間がインターフェイスと契約を設計し、AIが契約を満たす内部実装を担当することで、安全で保守性の高いコードを実現できます。

Zod + Branded Typeによりコンパイル時と実行時の両方で型安全性を保証し、冗長な事前条件・事後条件チェックを大幅に削減できます。

## 基本概念

契約による設計は3つの要素で構成されます。

- 事前条件
	- 関数実行前に満たすべき条件を定義します。不正な入力を早期に検出し、後続処理の安全性を保証します。Zodスキーマにより型レベルでの入力保証が可能になります。
- 事後条件
	- 関数実行後に保証される条件を定義します。出力データの妥当性をチェックし、実装の正確性を保証します。Branded Typeにより出力の意味的な型安全性も保証できます。
- 不変条件
	- 常に保たれる条件を定義します。オブジェクトの状態一貫性を維持し、データの整合性を保証します。

## AI駆動開発での価値

### 責任の明確な分離

人間は契約とインターフェイスを設計し、AIは契約を満たす実装のみを担当します。この分離により、AIの実装が契約を逸脱することを防げます。

### 設計時点での品質保証

テストコードが実装後の品質確認であるのに対し、契約による設計は実装中にも継続的に品質を保証します。バグの多くが実行時に自動検出されるため、本番での異常動作を防げます。

### 実装の柔軟性

契約を満たす限り、AIは実装を自由に変更できます。リファクタリング時も契約が変わらなければ安全性が保たれます。

## 基本的な実装パターン

## 日付処理での応用

JST形式の日付文字列を返す関数での契約実装を示します。

```typescript
import { z } from 'zod';

// 事前条件をZodスキーマで定義 + Branded Type
const ValidDateSchema = z
  .date()
  .refine((date) => !Number.isNaN(date.getTime()), '無効な日付です')
  .refine(
    (date) => date.getFullYear() >= 1900 && date.getFullYear() <= 2100,
    'サポート対象外の日付範囲です（1900-2100年）',
  )
  .brand<'ValidDate'>();

// 事後条件をZodスキーマで定義 + Branded Type
const JSTDateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD形式である必要があります')
  .refine((dateStr) => {
    const date = new Date(dateStr);
    return !Number.isNaN(date.getTime());
  }, '有効な日付文字列である必要があります')
  .brand<'JSTDateString'>();

type ValidDate = z.infer<typeof ValidDateSchema>;
type JSTDateString = z.infer<typeof JSTDateStringSchema>;

function formatDateToJST(date: ValidDate): JSTDateString {
  // 事前条件：ValidDate型により入力の妥当性が保証済み
  
  // 実装部分（AIに委譲）
  const result = generateDate(date);
  
  // 事後条件：JSTDateString型により出力の妥当性を保証
  return JSTDateStringSchema.parse(result);
}

// 使用例
const rawDate = new Date();
const validDate = ValidDateSchema.parse(rawDate); // 事前条件チェック
const result = formatDateToJST(validDate); // 変換のみ
```

## テストアプローチとの比較

### 契約による設計でのテスト

契約版では正常系のテストが中心になります。

```typescript
test('契約版テスト', () => {
  const rawDate = new Date('2024-01-15');
  const validDate = ValidDateSchema.parse(rawDate);
  
  const result = formatDateToJST(validDate);
  expect(result).toBe('2024-01-15');
  
  // 異常系は型レベル + スキーマで自動防止
  expect(() => ValidDateSchema.parse(new Date('1800-01-01'))).toThrow();
});
```

### 従来のテストアプローチ

通常版では全パターンをテストで記述する必要があります。

```typescript
function formatDateSimple(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

test('通常版テスト', () => {
  expect(formatDateSimple(new Date('2024-01-15'))).toBe('2024-01-15');
  expect(formatDateSimple(new Date('1800-01-01'))).toBe('1800-01-01'); // 不正だが通る
  expect(formatDateSimple(new Date('invalid'))).toBe('NaN-NaN-NaN'); // バグが通る
});
```

契約版ではバグの多くが型レベルとスキーマで自動防止されるため、テストは正常系中心で済みます。

## Zodとの関係

### 冗長性の削減

従来の契約による設計では各関数で同様のチェックを重複実装していましたが、Zodスキーマによる一元管理で解決できます。

```typescript
// 従来版（冗長）
function formatDateToJSTOld(date: Date): string {
  // 各関数で重複するチェック
  if (date.getFullYear() < 1900 || date.getFullYear() > 2100) {
    throw new Error('サポート対象外の日付範囲です');
  }
  
  const result = generateDate(date);
  
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result)) {
    throw new Error('出力フォーマットが不正です');
  }
  
  return result;
}

// 統合版（簡潔）
function formatDateToJST(date: ValidDate): JSTDateString {
  const result = generateDate(date);
  return JSTDateStringSchema.parse(result);
}
```

### 二重保証

Branded Typeによるコンパイル時の型安全性とZodスキーマによる実行時の値検証により、事前条件・事後条件が二重に保証されます。意味的に異なるデータ（営業日、配送日など）も型レベルで区別できます。

## 実装時の考慮事項

### 責任分離の原則

事前条件チェックを呼び出し元で行い、関数内部は純粋な変換処理に集中します。

```typescript
// 呼び出し元での事前条件チェック
function methodA() {
  const rawDate = new Date("2024-12-01");
  const validDate = ValidDateSchema.parse(rawDate); // 検証
  const result = formatDateToJST(validDate); // 変換のみ
}

// 関数内部は純粋な変換処理
function formatDateToJST(date: ValidDate): JSTDateString {
  const result = generateDate(date);
  return JSTDateStringSchema.parse(result);
}
```

この分離により、単一責任の原則を保ちながら、エラーハンドリングを呼び出し元で柔軟に制御できます。

## まとめ

契約による設計は、AI駆動開発において以下の価値を提供します。

設計時点での品質保証により、実装前後を通じた継続的な品質保証が可能になります。人間とAIの責任分離が明確になり、安全な協働が実現できます。契約を満たす限り実装変更が自由で、保守性が向上します。

冗長な事前条件・事後条件チェックがスキーマによる一元管理で解決され、コンパイル時と実行時の二重保証により真の型安全が実現されます。この継続性が、AI駆動開発において契約による設計がより本質的である理由です。