# ウィークリーレポート生成処理

Zenn記事の週次要約システム

## 実行指示
以下のスクリプトを実行して週次レポート生成してください。
- 実行スクリプト: `npx tsx src/scripts/generate-weekly-articles.ts ${START_DATE} ${END_DATE}`
- 環境変数: `START_DATE`、`END_DATE`、`CLOUDFLARE_D1_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`、`CLOUDFLARE_DATABASE_ID`が必要

## 処理手順
1. 週次データ取得スクリプトを実行
2. 取得したデータの各記事に対してAI要約を生成
3. 最終出力JSON構造に従ってファイルを生成
4. `src/data/weekly-report/YYYY-MM-DD.json` として保存
5. 変更をコミットしてPRを作成

## 要約品質基準
- 1記事あたり150-200文字程度
- 技術的なポイント・手法・解決した課題を重視

## 出力確認事項
- JSONファイルの構文が正しいこと
- weekRange情報が正確であること
- aiSummary フィールドが全記事に設定されていること
- weeklyRank が engagement.total の降順になっていること