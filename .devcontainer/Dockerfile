# Node.js 20の公式devcontainerイメージをベースに使用
# このイメージには開発に必要な基本的なツールが含まれています
FROM mcr.microsoft.com/devcontainers/javascript-node:20-bullseye

# pnpmをグローバルにインストール
RUN npm install -g pnpm

# 作業ディレクトリを設定
WORKDIR /workspace

# 非rootユーザーで実行（セキュリティのため）
USER node

# VS Code拡張機能の設定ディレクトリを作成
# TODO:
RUN mkdir -p /home/node/.vscode-server/extensions

# 環境変数を設定
# TODO:
ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# pnpmの設定
# TODO:
RUN pnpm config set store-dir ~/.pnpm-store