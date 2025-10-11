
こんにちは、開発推進部 SRE課のimamotoです。

SRE課ではSlackを使ってアラートを通知しているのですが、 今回はそのアラートを確認する運用を自動化してGitHub上で運用を完結させた話をしたいと思います。

## これまでのアラート確認運用について

まず、今回改善した運用について簡単に説明します。

### 運用の流れ

1. 毎朝Slackのチャンネル(対象:7チャンネル)を目視して、アラートの見落としが無いか確認
2. アラート内容の分析・判断
3. 必要に応じて対応の実施・手順書の作成
4. 対応状況を記録（チェックボックス）

### 解決したかった困りごと

#### ①見落とし・対応漏れのリスク

- Slackチャンネルを日次で目視確認し、「その日の運用を実施したか」のチェックボックスをチェックする運用にしていました
- この方法だと「どのアラートまで確認済みか」の管理まではできないため、アラートの見落としリスクがありました。

#### ②手順書作成コスト

- 新しいアラートが発生するたびに手順書を作成する際、作成のコストがありました。
- また、「一時的に無視しても良いアラート」についてはあまり手順化されておらず、アラート対応の属人化につながっていました。

#### ③見るべきツールが多い

- 7つのSlackチャンネルを目視確認し、必要に応じて適切なGrafanaダッシュボードを確認し、各所に分散した手順書を参照するので、運用が面倒でした

#### ④横展開の必要性

- SRE課以外でスプレッドシートでアラート情報を管理しているという事例がありました。
- 何らかの仕組みで管理を楽にして横展開したいと考えていました。

## 改善方針：GitHub Actionsを活用したアラート確認運用の自動化

前述した課題を解決するため、GitHub Actionsを活用してSlackアラートの確認を自動化しました。 運用は以下のような手順になりました。

- 毎朝GitHub Actionsをスケジュール起動して、Slackメッセージの収集・分類・GitHub Issueの作成を自動化
	- 分類されたアラートに対応したRunbookリンクがGitHub Issue上に記載されるので、それを元に運用を実施
- Runbookがない場合は、GitHubのIssueテンプレートからIssueを起票するとRunbookのマークダウンファイルを自動生成
- GitHub Issueに確認終了のラベルを付与すると、Slackに対応済みである旨を記録

![](https://cdn-ak.f.st-hatena.com/images/fotolife/i/imamoto/20250930/20250930090925.png)

### 1\. GitHub ActionsによるSlackメッセージの自動分類

Slackチャンネルの目視によるアラート分類の判断やRunbookの存在確認が非常に面倒だったため、  
**Slack Alert Analyzer** というツールを作成してGitHub Actionsから日次で実行する形にしました。

#### Slack Alert Analyzerの機能

- Slackアラートメッセージの収集・分類・フィルタリング
- GitHub Issueを起票して、分類したアラートの概要や対応するRunbook、メッセージ本文等をIssueに記載

#### 作成されたIssue例

Slack Alert Analyzerを実行すると、以下のようなIssueが起票されます。

- Issue本文：その日のアラート内容のサマリを記載
	- 過去1週間分のアラートを収集(対応済みのアラートを除く)

![](https://cdn-ak.f.st-hatena.com/images/fotolife/i/imamoto/20250930/20250930070459.png)

- Issueコメント：グルーピングされたアラート情報を記載
	- 正規表現ベースでグルーピング
	- アラート件数、発生元チャンネル、Runbookリンク等
	- Slackメッセージ本文もIssueコメント上から確認可能
	- 対応が完了したアラートのチェックボックスにチェックを入れる✅️

![](https://cdn-ak.f.st-hatena.com/images/fotolife/i/imamoto/20250930/20250930070757.png)

### 2\. 未知のアラートのRunbookを自動作成

- Slack Alert Analyzerの設定ファイルで「既知のアラート」として登録されていないメッセージの場合、GitHub Issue上にRunbookが表示されません。
- 既知のアラート登録用のIssueテンプレートを使用してIssueを作成すると、以下の2つの変更を行うPull Requestが作成されるようになっています。
	- Slack Alert Analyzerの設定ファイルに既知のアラートとして追加
	- Runbookとなるマークダウンファイルを作成

#### Issueテンプレート

- こんな感じのIssueテンプレートを使っています。
- Issueに `add-known-alert` ラベルが付与されます。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/i/imamoto/20250930/20250930085011.png)

#### Pull Request

- `add-known-alert` ラベルがついたIssue作成をトリガーにPull Requestが作成されます。
	- `knowledge/known-alerts.yaml` に既知のアラートとして情報を追記
	- `runbooks` フォルダに新しいRunbookファイルが作成される

![](https://cdn-ak.f.st-hatena.com/images/fotolife/i/imamoto/20250930/20250930085726.png)

### 3\. 対応完了処理

一通り確認が完了したら `resolved-alerts` ラベルをGitHub Issueに付与すると **Slack Alert Resolver** というツールがGitHub Actionsで自動実行されます。

#### Slack Alert Resolverの機能

- Issueコメント上でチェックが付いているSlackメッセージに対して「✅️」リアクションを付与
	- ✅️リアクションを付与すると、次回以降に確認対象として拾われなくなる
- Issueを自動クローズ

![](https://cdn-ak.f.st-hatena.com/images/fotolife/i/imamoto/20250930/20250930090054.png)

## 他チームへの横展開：Reusable workflowとTemplate Repositoryを利用

元々SREチームでのみ使っていたツールだったのですが、  
他チームにツールを展開するにあたって以下の対応を実施しました。  
これによって、Template Repositoryから作成したリポジトリから迅速にセットアップして利用できるようになりました。  
また、Reusable workflowにすることで、バグフィックス等の迅速な横展開も可能となりました。

- **Reusable workflow**: Slack Alert Analyzer, Slack Alert Resolverの実行用ワークフローを再利用可能な共通ワークフローとして展開
- **Template Repository**: Reusable workflowを呼び出すワークフローや、必要な設定ファイル・フォルダが準備された雛形のリポジトリを作成
	- 必要なセットアップ方法も、READMEに記載

### Template Repositoryについて

#### フォルダ構成

必要なワークフローやIssueテンプレート、設定ファイルが含まれています。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/i/imamoto/20250930/20250930091603.png)

#### README

こんな感じでREADMEにセットアップ方法を記載しています。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/i/imamoto/20250930/20250930090333.png)

## 効果

- 定常的な運用の動線を減らして運用を楽にすると、運用者の負荷を下げるだけでなく、品質も向上しました。
	- 特にRunbook作成へのモチベーションが上がりました。
- 他チームへの横展開も迅速に開始することができました。

## おわりに

今回のツールはチームの為に作ったという建付けなのですが、私自身も本当に運用作業が苦手でして、、  
実は自分が一番このツールの存在を喜んでいるかもしれません。  
  
また、今回のツール作成はGitHub CopilotのAgentモードを使って行いましたが、要件の壁打ちも含めて初版は2時間以内に作成することができました。  
ちょっとした自作ツールの作成ハードルが生成AIの活用によって本当に低くなっていると感じるので、  
**「運用つれぇ…」** と思ったら何か作ってみるのもオススメです。  
（適材適所で、生成物の品質やメンテナンスについては責任を持つ前提で）  
  
それでは、ブログをご覧いただきありがとうございました！

[« AIエージェントはSaaSをどう変える？ラク…](https://tech-blog.rakus.co.jp/entry/20250930/AIagent) [BtoB SaaSにおけるPasskey認証の可能性 - … »](https://tech-blog.rakus.co.jp/entry/20250930/passkey-auth)

![](https://cdn.blog.st-hatena.com/images/admin/quote/quote-x-icon.svg?version=9f3d2a69deb4e4b689c1a23af3625d "引用して投稿する")