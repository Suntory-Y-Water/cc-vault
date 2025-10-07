# Release Please ワークフローのCI失敗事象

## 発生日時
2025-10-06

## 事象の概要
Release Pleaseワークフローの`Enable auto-merge for release PR`ジョブが失敗しました。

- 失敗したアクション: https://github.com/Suntory-Y-Water/cc-vault/actions/runs/18297204481/job/52097913318
- 対象PR: #55 (chore(main): release 1.0.5)

## エラー内容
```
GraphQL: Pull request Pull request is in clean status (enablePullRequestAutoMerge)
##[error]Process completed with exit code 1.
```

## 根本原因
`gh pr merge --auto --squash`コマンド実行時、Cloudflare Workersのビルドチェックが`pending`状態でした。

auto-merge設定には、すべての必須チェックの完了が必要ですが、以下のチェックが未完了でした:
- Workers Builds: cc-vault (pending)

## 環境情報
- Cloudflare Workersのデプロイ設定: CloudflareダッシュボードGUIで設定（YMLファイルには未定義）
- ブランチ保護ルール: Cloudflare Workersのチェックが必須チェックに含まれている

## 対策
### 実施した対策
`.github/workflows/release-please.yml`に、チェック完了待機ステップを追加しました:

```yaml
- name: Wait for checks to complete
  if: ${{ steps.release-please.outputs.pr }}
  run: |
    PR_NUMBER=$(echo "$PR_JSON" | jq -r '.number')
    gh pr checks "$PR_NUMBER" --watch
  env:
    GH_TOKEN: ${{ github.token }}
    PR_JSON: ${{ steps.release-please.outputs.pr }}
```

`gh pr checks --watch`コマンドにより、すべての必須チェック（Cloudflare Workersを含む）が完了してからauto-mergeを有効化するようになりました。

## 結果
- 一時的には手動でマージして解決
- 今後は自動的にチェック完了を待機してからauto-mergeが実行される
