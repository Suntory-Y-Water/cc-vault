# Node.js 20の公式devcontainerイメージをベースに使用
# このイメージには開発に必要な基本的なツールが含まれています
FROM mcr.microsoft.com/devcontainers/javascript-node:20-bullseye

# pnpmをグローバルにインストール (rootユーザーで実行)
RUN npm install -g pnpm

# 作業ディレクトリを設定 
WORKDIR /workspace

# 非rootユーザー 'node' として実行する設定
# devcontainer.json の remoteUser と合わせる
USER node

# nodeユーザーの環境変数を設定
ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

# nodeユーザーでpnpmの設定 (ホームディレクトリ ~/.pnpm-store は /home/node/.pnpm-store を指す)
RUN pnpm config set store-dir ~/.pnpm-store