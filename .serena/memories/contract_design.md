# 契約による設計とAI駆動開発ガイド

このドキュメントでは、AI駆動開発において契約による設計がテストコードよりも本質的である理由と、実際のプロジェクトでの活用方法を説明します。

## 概要

契約による設計(Contract-Driven Design)は、関数やモジュール間の責任を明確にし、インターフェイスに対する要件を事前定義する設計手法です。
AI駆動開発では、人間がインターフェイスと契約を設計し、AIが契約を満たす内部実装を担当することで、安全で保守性の高いコードを実現できます。

## 基本概念

契約による設計は3つの要素で構成されます。

- 事前条件
	- 関数実行前に満たすべき条件を定義します。不正な入力を早期に検出し、後続処理の安全性を保証します。
- 事後条件
	- 関数実行後に保証される条件を定義します。出力データの妥当性をチェックし、実装の正確性を保証します。
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
function formatDateToJST(date: Date): string {
  // 事前条件、想定されない日付をブロック
  if (date.getFullYear() < 1900 || date.getFullYear() > 2100) {
    throw new Error('サポート対象外の日付範囲です');
  }

  // 実装部分(AIに委譲)
  const result = generateDate(date);

  // 事後条件
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result)) {
    throw new Error('出力フォーマットが不正です');
  }

  return result;
}
```

AIには日付計算ロジックのみを任せ、入力検証と出力検証は契約で保証します。

## クローラーでの実装例

Webクローラーでの要素取得における契約適用例を示します。

```typescript
function getDateFromElement(selector: string): Date {
  // 事前条件
  if (selector === '') {
    throw new Error('Invalid selector');
  }

  const element = document.querySelector(selector);
  if (!element || !element.textContent) {
    throw new Error(`Element not found: ${selector}`);
  }

  const text = element.textContent.trim();

  // 事後条件: 日付形式チェック
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    throw new Error(`Invalid date format: ${text}`);
  }

  const date = new Date(text);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${text}`);
  }

  // 事後条件: 合理的範囲チェック
  const year = date.getFullYear();
  if (year < 1900 || year > 2100) {
    throw new Error(`Date out of range: ${year}`);
  }

  return date;
}
```

従来の「要素存在チェックのみ」から「データ形式・値チェック」まで拡張することで、サイト仕様変更の早期検出と異常データ混入を防げます。

## テストアプローチとの比較

### 契約による設計でのテスト

契約版では正常系のテストが中心になります。

```typescript
test('契約版テスト', () => {
  const account = { balance: 1000, id: 'user1' };
  
  const result = withdraw(account, 300);
  expect(result.balance).toBe(700);
  
  // 異常系は関数が自動で防ぐ
  expect(() => withdraw(account, 1500)).toThrow();
});
```

### 従来のテストアプローチ

通常版では全パターンをテストで記述する必要があります。

```typescript
function withdrawSimple(account: Account, amount: number): Account {
  return {
    ...account,
    balance: account.balance - amount
  };
}

test('通常版テスト', () => {
  const account = { balance: 1000, id: 'user1' };
  
  expect(withdrawSimple(account, 300).balance).toBe(700);
  expect(withdrawSimple(account, 1500).balance).toBe(-500); // バグが通る
  expect(withdrawSimple(account, -100).balance).toBe(1100); // バグが通る
});
```

契約版ではバグの多くが実行時に自動検出されるため、テストは正常系中心で済みます。通常版では全ケースを網羅する必要があり、書き忘れると本番でバグが発生します。

## 既存ツールとの関係

### Zodとの共通点

Zodの入力バリデーション機能は契約による設計の事前条件と同じ役割を果たします。

```typescript
import { z } from 'zod';

const DateSchema = z.date()
  .refine(date => !isNaN(date.getTime()), 'Invalid date');

function formatDateWithZod(date: Date): string {
  const validDate = DateSchema.parse(date);
  return doFormatting(validDate);
}
```

### 契約による設計の拡張範囲

契約による設計はZodが担当する事前条件に加えて、以下もカバーします。

事後条件では出力データの形式・値をチェックします。不変条件ではオブジェクトの状態一貫性をチェックします。ビジネスルールではドメイン固有の制約をチェックします。

Zodは契約による設計の事前条件部分を実装する優秀なツールですが、AI駆動開発では事後条件や不変条件も重要です。

## 実装時の考慮事項

### 関数の粒度問題

契約による設計を適用すると、処理ごとに対応する関数が必要になります。

```typescript
function getDateFromElement(selector: string): Date { ... }
function getPriceFromElement(selector: string): number { ... }
function getEmailFromElement(selector: string): string { ... }
```

この関数増加は一見問題に見えますが、以下の利点があります。

各関数の責任が明確になります。何をしているか一目で分かります。デバッグが容易になります。AIへの指示が具体的になります。

### 過度な共通化の問題

汎用的なアプローチは可読性を損ないます。

```typescript
// 読みにくい例
const date = getElementValue('.date', Rules.date);
const price = getElementValue('.price', Rules.price);
```

素直な実装の方が理解しやすく、保守性が高くなります。

```typescript
// 読みやすい例
const date = getDateFromElement('.date');
const price = getPriceFromElement('.price');
```

### 実践的なアプローチ

関数が増えることを受け入れ、可読性を重視する方が実用的です。過度な抽象化や共通化は避け、明確で理解しやすい実装を心がけます。

## まとめ

契約による設計は、AI駆動開発において以下の価値を提供します。

設計時点での品質保証により、実装前にバグを防止できます。人間とAIの責任分離が明確になり、安全な協働が可能になります。契約を満たす限り実装変更が自由で、保守性が向上します。

テストコードが実装後の品質確認であるのに対し、契約による設計は実装中にも継続的に品質を保証します。この継続性が、AI駆動開発において契約による設計がより本質的である理由です。