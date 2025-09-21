#!/bin/bash

# bun, uvのインストール。MCPサーバやClaude CodeのHooksで使用する
curl -LsSf https://astral.sh/uv/install.sh | sh
curl -fsSL https://bun.sh/install | bash

# 環境パスの設定
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc

echo "Installation completed!"

# npmとnpxを使用させずpnpmを使うようにする設定
echo '' >> ~/.bashrc
echo 'alias npx="echo \"WARNING: npx は使用しないでください。代わりに、pnpm dlx を使用してください。\" && false"' >> ~/.bashrc
echo 'alias npm="echo \"WARNING: npm は使用しないでください。代わりに、pnpm を使用してください。\" && false"' >> ~/.bashrc