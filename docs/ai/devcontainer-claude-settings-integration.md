# DevContainer Claude Code設定集統合

## 課題

個人で設定したClaude Codeの設定集をDevContainerで使用しつつ、リビルド時に認証情報も引き継げるようにする必要があった。

- 設定集リポジトリ: https://github.com/Suntory-Y-Water/claude-code-settings
- 認証情報の永続化を維持
- 設定集の自動インストール

## 実装したファイル

### `.devcontainer/post_create.sh`

Claude Code設定集の自動インストール処理を追加。

## 実装内容

### 認証情報保護ロジック

```bash
if [ -d "/home/node/.claude" ]; then
    # 認証ファイルをバックアップ
    cp /home/node/.claude/.claude.json* /tmp/ 2>/dev/null || true
    cp /home/node/.claude/.credentials.json /tmp/ 2>/dev/null || true

    # 設定集をクローンして上書き
    cd /tmp
    git clone https://github.com/Suntory-Y-Water/claude-code-settings.git
    cp -r claude-code-settings/* /home/node/.claude/

    # 認証ファイルを復元
    cp /tmp/.claude.json* /home/node/.claude/ 2>/dev/null || true
    cp /tmp/.credentials.json /home/node/.claude/ 2>/dev/null || true

    rm -rf /tmp/claude-code-settings
else
    git clone https://github.com/Suntory-Y-Water/claude-code-settings.git /home/node/.claude
fi
```

### 依存関係インストール

設定集はbunを使用しているため、`bun install`で依存関係をインストール:

```bash
if [ -f "/home/node/.claude/package.json" ]; then
    cd /home/node/.claude
    bun install
fi
```

### 権限設定

```bash
chown -R node:node /home/node/.claude
```

## 動作

1. コンテナ作成時に認証ファイル（`.claude.json*`, `.credentials.json`）をバックアップ
2. 設定集リポジトリをクローンして設定を上書き
3. 認証ファイルを復元
4. bunで依存関係をインストール
5. 適切な権限を設定

これにより、DevContainerリビルド時にClaude Code認証が保持されつつ、個人設定集が自動適用される。