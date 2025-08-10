# テストコード実装時の教訓

## 初回実装での失敗と修正

### 失敗内容
契約による設計に基づくテストコード実装で、実際のライブラリ動作や関数仕様を確認せずに推測でテストを書いた結果、6件のテスト失敗が発生した。

### 具体的な失敗例

#### 1. ライブラリ動作の推測ミス
```typescript
// 失敗例：date-fnsは無効な日付でエラーを投げないと推測
expect(() => formatDateToString(invalidDate)).not.toThrow();

// 実際：date-fnsはRangeErrorを投げる
expect(() => formatDateToString(invalidDate)).toThrow(RangeError);
```

#### 2. 関数の実装詳細を未確認
```typescript
// 失敗例：isValidDateStringはnullでTypeErrorを投げると推測
expect(() => isValidDateString(null as any)).toThrow(TypeError);

// 実際：TypeScriptの型システムで保護され、falseを返す
expect(isValidDateString(null as any)).toBe(false);
```

#### 3. 日付計算の結果を推測
```typescript
// 失敗例：8月9日（土曜日）の週の開始を8月5日と推測
WEEK_START: '2025-08-05'

// 実際：8月4日（月曜日）が正しい
WEEK_START: '2025-08-04'
```

### 修正後のベストプラクティス

#### 1. 実装を先に確認する
- テスト対象の関数の実装を読む
- 使用しているライブラリの仕様を確認
- 推測でテストを書かない

#### 2. テスト名の直感性を重視
```typescript
// 改善前：技術的な詳細に焦点
'Given null When isValidDateString()を実行 Then falseを返すこと（TypeScriptの型システムで保護）'

// 改善後：ビジネスロジックに焦点
'Given null When isValidDateString()を実行 Then 不正な値としてfalseを返すこと'
```

#### 3. 固定値の適切な管理
- 使い回す値は固定値で定義
- 一度しか使わない値は直接記述で可
- 保守性と変更可能性を優先

#### 4. 型検証より値の妥当性検証
```typescript
// 改善前：型のみ確認
expect(typeof result.year).toBe('number');

// 改善後：値の妥当性確認
expect(result.year).toBeGreaterThan(2020);
expect(result.year).toBeLessThan(2100);
```

#### 5. エラー文字列の比較は避ける
```typescript
// 改善前：エラー文字列を比較
expect(() => isFutureWeek(invalidDateString)).toThrow('無効な日付文字列です');

// 改善後：エラー発生のみ確認
expect(() => isFutureWeek(invalidDateString)).toThrow();
```

## 学習事項

### 契約による設計とテストの関係
- 事前条件：関数が期待する入力の検証
- 事後条件：関数が保証する出力の検証
- 不変条件：常に成り立つべき条件の検証

### Given-When-Thenパターンの価値
- Given：テストの前提条件を明確に
- When：テスト対象の操作を明確に
- Then：期待する結果を明確に

### テストの保守性
- エラーメッセージに依存しない
- ライブラリのバージョンアップに耐える
- 変更可能性を考慮した設計

## 今後の改善点
1. 実装確認を最優先する
2. 推測ではなく事実に基づく
3. 直感的で分かりやすいテスト名
4. 保守性を重視した設計
5. ビジネスロジックに焦点を当てた検証