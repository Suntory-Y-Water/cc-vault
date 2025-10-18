# Slackアラート運用改善：次の作業手順

## 現在の状態

✅ **完了済み:**
- GitHub Actionsでの基本的なIssue自動作成機能
  - `.github/workflows/slack-alert-collector.yml`
  - `.github/scripts/create-alert-issue.cjs`
  - `.github/types/actions.ts`

## 次のステップ

### 1. 未知のアラートのRunbook自動作成 (優先度: 高)

**目的:** アラート対応の属人化を防ぎ、手順書作成コストを削減

**実装内容:**
- `add-known-alert`ラベルが付いたIssue作成をトリガーにPRを自動作成
- `knowledge/known-alerts.yaml`に既知のアラート情報を追記
- `runbooks/`フォルダに新しいRunbookファイルを自動生成

**必要な作業:**
1. Issueテンプレートの作成（`.github/ISSUE_TEMPLATE/add-known-alert.yml`）
2. 既知のアラート設定ファイルのスキーマ定義（`knowledge/known-alerts.yaml`）
3. Runbook自動生成スクリプトの作成（`.github/scripts/create-runbook-pr.cjs`）
4. Issueラベルをトリガーにしたワークフローの作成（`.github/workflows/create-runbook.yml`）

**参考:**
- ラクスSREチームの事例: `docs/Slackアラート運用をGitHub上で完結！SREチームの自動化事例.md`

---

### 2. 対応完了処理の自動化 (優先度: 中)

**目的:** 確認済みアラートに対して、Slackにリアクションを付与して記録を残す

**実装内容:**
- `resolved-alerts`ラベル付与をトリガーに実行
- Issueコメントのチェックボックスを確認
- チェック済みSlackメッセージに✅リアクションを付与
- Issueを自動クローズ

**必要な作業:**
1. Slack Alert Resolverスクリプトの作成（`.github/scripts/resolve-alerts.cjs`）
2. Slack Reactions API統合
3. Issueコメントパーサーの実装
4. ラベルトリガーのワークフロー作成（`.github/workflows/resolve-alerts.yml`）

---

### 3. アラートの分類・グルーピング機能 (優先度: 中)

**目的:** 正規表現ベースでアラートを分類し、Runbookと紐付ける

**実装内容:**
- 設定ファイル(`known-alerts.yaml`)を読み込み
- 正規表現パターンでアラートをグルーピング
- Runbookリンクを自動付与
- 発生件数やチャンネル情報をサマリ表示

**必要な作業:**
1. 既存の`create-alert-issue.cjs`にグルーピングロジックを追加
2. `known-alerts.yaml`からパターンマッチングを実装
3. Issue本文フォーマットの改善（サマリ情報の追加）
4. Issueコメントへのグルーピング結果の出力

---

## 設計上の考慮事項

### 設定ファイル構造（案）

`knowledge/known-alerts.yaml`:
```yaml
known_alerts:
  - name: "データベース接続エラー"
    pattern: "\\[ERROR\\].*database connection failed"
    severity: high
    runbook: "runbooks/database-connection-error.md"
    description: "データベース接続に失敗した際のアラート"

  - name: "API レート制限"
    pattern: "\\[WARNING\\].*rate limit exceeded"
    severity: medium
    runbook: "runbooks/api-rate-limit.md"
    description: "APIのレート制限に達した際の警告"
```

### Runbookテンプレート（案）

`runbooks/template.md`:
```markdown
# [アラート名]

## 概要

[アラートの概要説明]

## 発生条件

[どのような条件で発生するか]

## 対応手順

1. [手順1]
2. [手順2]
3. [手順3]

## 確認事項

- [ ] [確認項目1]
- [ ] [確認項目2]

## 参考リンク

- [関連するダッシュボードやドキュメント]
```

---

## 推奨実装順序

1. **フェーズ1:** 未知のアラートのRunbook自動作成
   - アラート管理の基盤（設定ファイル、Runbook構造）を整備

2. **フェーズ2:** アラートの分類・グルーピング機能
   - 既存のIssue作成機能を拡張

3. **フェーズ3:** 対応完了処理の自動化
   - 運用フローを完全に自動化

---

## 参考資料

- `docs/Slackアラート運用の改善（ラクスとの比較）.md` - 改善方針と要件
- `docs/Slackアラート運用をGitHub上で完結！SREチームの自動化事例.md` - 実装の参考事例
- `.github/workflows/slack-alert-collector.yml` - 現在のワークフロー
