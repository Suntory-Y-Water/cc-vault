# ウィークリーレポート生成処理

## 実行指示
以下の仕様書に従って週次レポート生成処理を実行してください。
- 仕様書ファイル: `docs/weekly-report-spec.md`
- 実行スクリプト: `npx tsx src/scripts/generate-weekly-articles.ts`

## 処理手順
1. 仕様書ファイルを読み込んで処理要件を理解
2. 週次データ取得スクリプトを実行
3. 取得したデータの各記事に対してAI要約を生成
4. 最終出力JSON構造に従ってファイルを生成
5. `src/data/weekly-report/YYYY-MM-DD.json` として保存
6. 変更をコミットしてPRを作成

## 要約品質基準
- 1記事あたり150-200文字程度
- 技術的なポイント・手法・解決した課題を重視

## 出力確認事項
- JSONファイルの構文が正しいこと
- weekRange情報が正確であること
- aiSummary フィールドが全記事に設定されていること
- weeklyRank が engagement.total の降順になっていること