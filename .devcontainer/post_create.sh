#!/bin/bash

# bun, uvのインストール。MCPサーバやClaude CodeのHooksで使用する
curl -LsSf https://astral.sh/uv/install.sh | sh
curl -fsSL https://bun.sh/install | bash

# 環境パスの設定
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc

# Codex cliのインストール
npm i -g @openai/codex

echo "Installation completed!"

# Claude Code設定集のインストール
echo "Installing Claude Code settings..."

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

# 依存関係のインストール
if [ -f "/home/node/.claude/package.json" ]; then
    cd /home/node/.claude
    # 初期セットアップ時は絶対パスじゃないとPATHが通っていないため
    ~/.bun/bin/bun install
fi

chown -R node:node /home/node/.claude
echo "Claude Code settings installation completed!"

# npmとnpxを使用させずpnpmを使うようにする設定
echo '' >> ~/.bashrc
echo 'alias npx="echo \"WARNING: npx は使用しないでください。代わりに、pnpm dlx を使用してください。\" && false"' >> ~/.bashrc
echo 'alias npm="echo \"WARNING: npm は使用しないでください。代わりに、pnpm を使用してください。\" && false"' >> ~/.bashrc