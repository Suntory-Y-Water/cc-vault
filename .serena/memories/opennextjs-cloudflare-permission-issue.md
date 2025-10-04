# @opennextjs/cloudflare ビルド時のファイルパーミッション問題

## 問題の概要

Docker Desktop for Mac環境の開発コンテナ内で`@opennextjs/cloudflare build`を実行すると、生成される`open-next.config.mjs`ファイルのパーミッションが異常になり、esbuildがファイルを読み込めずにビルドが失敗します。一方、ホストOS（macOS）上で同じコマンドを実行すると正常にビルドが完了します。

## エラー内容

```
✘ [ERROR] Could not resolve "./open-next.config.mjs"

    .open-next/server-functions/default/index.mjs:1949:30:
      1949 │   const config = await import("./open-next.config.mjs").then((m) => m.default);
           ╵                               ~~~~~~~~~~~~~~~~~~~~~~~~

Error: Build failed with 1 error:
.open-next/server-functions/default/index.mjs:1949:30: ERROR: Could not resolve "./open-next.config.mjs"
```

このエラーは`pnpm run schedule`コマンド（内部で`opennextjs-cloudflare build && wrangler dev --test-scheduled`を実行）によって発生します。

## 環境情報

**ホストOS環境**
- macOS（Docker Desktop使用）
- ファイルシステム: APFS

**開発コンテナ環境**
- VSCode Dev Container
- マウントされたファイルシステムタイプ: `fakeowner`
- ユーザー: `node` (uid=1000, gid=1000)

**パッケージバージョン**
```json
{
  "@opennextjs/cloudflare": "^1.8.3",
  "next": "15.5.0",
  "wrangler": "^4.38.0"
}
```

**開発コンテナのベースイメージ（両方で試行）**
- `mcr.microsoft.com/devcontainers/javascript-node:22-bookworm`
- `node:22-bookworm`

## 詳細な調査結果

### ファイルシステムタイプの確認

開発コンテナ内のワークスペースは、Docker Desktop for Macの`fakeowner`というファイルシステムでマウントされています。

```bash
$ df -T /workspaces/cc-vault
Filesystem           Type      1K-blocks      Used Available Use% Mounted on
/run/host_mark/Users fakeowner 482797652 107474464 375323188  23% /workspaces/cc-vault
```

`fakeowner`は、Docker Desktop for Mac/Windows環境でホストOSのファイルシステムをコンテナにマウントする際に使用される特殊なファイルシステムドライバです。このファイルシステムは、一部のUNIXパーミッション操作を正しく処理できないことが知られています。

### 生成されるファイルのパーミッション異常

`.open-next/.build/`ディレクトリに生成される設定ファイルのパーミッションが`0200`（書き込み専用）になっています。

```bash
$ ls -la .open-next/.build/
total 44
drwxr-xr-x  7 node node   224 Oct  4 06:31 .
drwxr-xr-x 11 node node   352 Oct  4 06:31 ..
-rw-r--r--  1 node node 17288 Oct  4 06:31 cache.cjs
-rw-r--r--  1 node node  6243 Oct  4 06:31 composable-cache.cjs
drwxr-xr-x  5 node node   160 Oct  4 06:31 durable-objects
--w-------  1 node node  6756 Oct  4 06:31 open-next.config.edge.mjs
--w-------  1 node node  6978 Oct  4 06:31 open-next.config.mjs
```

`stat`コマンドでの詳細情報:

```bash
$ stat .open-next/.build/open-next.config.mjs
  File: .open-next/.build/open-next.config.mjs
  Size: 6978      	Blocks: 16         IO Block: 4096   regular file
Device: 0,42	Inode: 226871      Links: 1
Access: (0200/--w-------)  Uid: ( 1000/    node)   Gid: ( 1000/    node)
```

通常、ビルドプロセスで生成されるファイルは`0644`（`-rw-r--r--`）のような読み取り可能なパーミッションになるべきですが、ここでは`0200`（`--w-------`、所有者のみ書き込み可能）という異常な状態になっています。

### コピー先ファイルの完全な破損

さらに問題なのは、`.open-next/server-functions/default/`にコピーされた`open-next.config.mjs`のパーミッションが完全に破損していることです。

```bash
$ ls -la .open-next/server-functions/default/
-?????????  ? ?    ?        ?            ? open-next.config.mjs
ls: cannot access '.open-next/server-functions/default/open-next.config.mjs': Permission denied
```

`-?????????`という表示は、ファイルシステムレベルでパーミッション情報が取得できない状態を示しています。このため、esbuildがこのファイルをインポートしようとしても、ファイルシステムレベルでアクセスが拒否されてしまいます。

### ホストOSでの動作確認

同じプロジェクトをホストOS（macOS）上で直接ビルドすると、すべてのファイルが正常なパーミッション（`-rw-r--r--`）で生成され、ビルドも成功します。これにより、問題がコンテナ環境特有のものであることが確認できました。

### ベースイメージ変更による検証

開発コンテナのベースイメージを以下の順で変更して検証しましたが、いずれも同じエラーが発生しました。

1. `mcr.microsoft.com/devcontainers/javascript-node:22-bookworm`（元の設定）→ エラー発生
2. `node:22-bookworm`（公式イメージに変更）→ 同じエラーが発生

この結果から、Nodeイメージの種類やベンダーには依存せず、ファイルシステムレベルの問題であることが裏付けられました。

### ユーザー権限の確認

開発コンテナ内のユーザー権限は正しく設定されており、UID/GIDの不一致などの問題はありません。

```bash
$ id
uid=1000(node) gid=1000(node) groups=1000(node),102(docker),998(nvm),999(npm)
```

ファイルの所有者も同じく`1000:1000`であり、ユーザー権限の問題ではないことが確認できました。

## 根本原因の推定

この問題は、以下の2つの要因が組み合わさって発生していると考えられます。

1. **`@opennextjs/cloudflare`のビルドプロセスが`0200`パーミッションでファイルを作成している**
   
   ビルドツールが何らかの理由（セキュリティ目的またはバグ）で、通常とは異なる制限的なパーミッションでファイルを生成しています。

2. **Docker Desktop for Macの`fakeowner`ファイルシステムがこの特殊なパーミッション設定を正しく処理できない**
   
   `fakeowner`ファイルシステムは、ホストOS（macOS/Windows）とコンテナ間でのファイル共有を実現するための抽象化レイヤーですが、特殊なパーミッション設定を扱う際に正しく動作しないことがあります。通常のLinuxファイルシステムであれば`0200`でも所有者は操作できますが、`fakeowner`ではパーミッション情報が完全に破損してしまいます。

ホストOS上では通常のAPFSファイルシステムが使用されるため、同じビルドプロセスでも正常に動作します。

## 設定ファイル

問題が発生するプロジェクトの設定ファイルは以下の通りです。

**open-next.config.ts**
```typescript
import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig();
```

**next.config.ts**
```typescript
import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

initOpenNextCloudflareForDev();
```

**wrangler.jsonc（関連部分のみ）**
```jsonc
{
  "main": "./custom-worker.ts",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  }
}
```

## 再現手順

1. Docker Desktop for Macがインストールされた環境で、VSCode Dev Containerを使用してプロジェクトを開く
2. 開発コンテナ内で`pnpm install`を実行して依存関係をインストール
3. `pnpm run schedule`を実行（内部で`opennextjs-cloudflare build`が実行される）
4. 上記のエラーが発生してビルドが失敗する

ホストOS（macOS）上で直接同じコマンドを実行すると、ビルドは成功します。

## 補足情報

DeepWikiでの調査により、`open-next.config.ts`は`.open-next/.build/open-next.config.edge.mjs`にコンパイルされ、それが`.open-next/server-functions/default/`にコピーされる仕組みであることが分かっています。コンパイルされたファイル自体は存在し、内容も正常ですが、パーミッションの問題によりアクセスできない状態です。
