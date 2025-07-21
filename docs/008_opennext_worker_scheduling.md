# 008 OpenNext.js Worker スケジューリング

## 概要

OpenNext.jsでCloudflare Workersのscheduled handler（スケジューリング機能）を使用する方法について。

## 基本的な使い方

### 1. カスタムWorkerの作成

OpenNext.jsが生成するWorkerは通常fetch handlerのみをエクスポートしますが、scheduled handlerを追加するためにカスタムWorkerを作成できます。

```ts
// custom-worker.ts

// @ts-ignore `.open-next/worker.ts` is generated at build time
import { default as handler } from "./.open-next/worker.js";

export default {
  fetch: handler.fetch,

  async scheduled(event) {
    // スケジュール処理をここに記述
    console.log('Scheduled event triggered:', event.scheduledTime);
    
    // 例：定期的なデータ処理
    // await processScheduledTask();
  },
} satisfies ExportedHandler<CloudflareEnv>;

// Durable Object関連の再エクスポート（必要な場合のみ）
// @ts-ignore `.open-next/worker.ts` is generated at build time
export { DOQueueHandler, DOShardedTagCache } from "./.open-next/worker.js";
```

### 2. wrangler.jsonc設定の更新

```diff
// wrangler.jsonc
{
-  "main": "./.open-next/worker.js"
+  "main": "./custom-worker.ts",
+  
+  // スケジュールの設定
+  "triggers": {
+    "crons": ["0 0 * * *"]  // 毎日午前0時に実行
+  }
}
```

## 実装例

### 基本的なスケジュール処理

```ts
// custom-worker.ts
import { default as handler } from "./.open-next/worker.js";

export default {
  fetch: handler.fetch,

  async scheduled(event: ScheduledEvent, env: CloudflareEnv, ctx: ExecutionContext) {
    try {
      // 定期的なタスクの実行
      await performMaintenanceTask(env);
      
      console.log(`Scheduled task completed at ${event.scheduledTime}`);
    } catch (error) {
      console.error('Scheduled task failed:', error);
    }
  },
} satisfies ExportedHandler<CloudflareEnv>;

async function performMaintenanceTask(env: CloudflareEnv) {
  // データベースのクリーンアップ
  // キャッシュの更新
  // レポートの生成など
}
```

### データベース操作を含む例

```ts
// custom-worker.ts
import { default as handler } from "./.open-next/worker.js";

export default {
  fetch: handler.fetch,

  async scheduled(event: ScheduledEvent, env: CloudflareEnv, ctx: ExecutionContext) {
    // D1データベースでの定期処理
    if (env.DB) {
      const result = await env.DB.prepare(
        "DELETE FROM logs WHERE created_at < datetime('now', '-7 days')"
      ).run();
      
      console.log(`Cleaned up ${result.changes} old log entries`);
    }
  },
} satisfies ExportedHandler<CloudflareEnv>;
```

## スケジュール設定

### cron式の例

```json
{
  "triggers": {
    "crons": [
      "0 0 * * *",      // 毎日午前0時
      "0 */6 * * *",    // 6時間ごと
      "0 0 * * 1",      // 毎週月曜日午前0時
      "0 2 1 * *"       // 毎月1日午前2時
    ]
  }
}
```

## 困ったときの参照先

### OpenNext.js公式ドキュメント
- **カスタムWorker**: `docs/cloudflare/opennext-docs/opennext/howtos/custom-worker.mdx`
- **バインディング設定**: `docs/cloudflare/opennext-docs/opennext/bindings.mdx`
- **トラブルシューティング**: `docs/cloudflare/opennext-docs/opennext/troubleshooting.mdx`

### Cloudflare公式ドキュメント
- **Scheduled Handlers**: https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/
- **Cron Triggers**: https://developers.cloudflare.com/workers/configuration/cron-triggers/
- **Worker Configuration**: https://developers.cloudflare.com/workers/configuration/

### 実装例
- **リポジトリの例**: https://github.com/opennextjs/opennextjs-cloudflare/blob/main/examples/playground14/worker.ts

## 注意事項

1. **生成されたfetch handlerの再利用**：OpenNext.jsが生成したfetch handlerを必ず再利用すること
2. **Durable Objectの再エクスポート**：アプリがDO Queue或いはDO Tag Cacheを使用している場合は再エクスポートが必要
3. **型安全性**：`ExportedHandler<CloudflareEnv>`型を使用して型安全性を確保
4. **エラーハンドリング**：scheduled handler内では適切なエラーハンドリングを実装すること

## 関連ファイル

- `wrangler.jsonc` - Worker設定とcron設定
- `custom-worker.ts` - カスタムWorkerの実装
- `.open-next/worker.js` - OpenNext.jsが生成するベースWorker