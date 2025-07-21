## Open Next.js Docs

OpenNext.jsのCloudflareドキュメントを確認するときに使用するコマンドです。

## 最初に使用するときはファイルの内容を全部読み込まない

`head -n 40`のように最初は上から40行だけ確認後、要件を満たす情報がある場合に限り、ファイルの内容を全て確認する。

## 個別ファイルを確認する場合は以下のコマンドを使用します。

```bash
# メインドキュメント
cat docs/cloudflare/opennext-docs/opennext/index.mdx

# 始め方
cat docs/cloudflare/opennext-docs/opennext/get-started.mdx

# バインディング設定
cat docs/cloudflare/opennext-docs/opennext/bindings.mdx

# キャッシュ
cat docs/cloudflare/opennext-docs/opennext/caching.mdx

# 既知の問題
cat docs/cloudflare/opennext-docs/opennext/known-issues.mdx

# トラブルシューティング
cat docs/cloudflare/opennext-docs/opennext/troubleshooting.mdx

# How-toガイド
find docs/cloudflare/opennext-docs/opennext/howtos -name "*.mdx" -exec echo "=== {} ===" \; -exec cat {} \; -exec echo -e "\n\n" \;
```

## 全てのドキュメントを再帰的に確認する。

```bash
find docs/cloudflare/opennext-docs/opennext -name "*.mdx" -type f | sort | while read file; do
  echo "=== $file ==="
  cat "$file"
  echo -e "\n\n"
done
```