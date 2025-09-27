FROM mcr.microsoft.com/devcontainers/javascript-node:22-bookworm

# pnpm install
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

# npm global install のEACCESエラー対策
ENV NPM_CONFIG_PREFIX=/usr/local/share/npm-global
ENV PATH=$PATH:/usr/local/share/npm-global/bin

# Claude設定ディレクトリの権限設定
RUN mkdir -p /home/node/.claude && \
    chown -R node:node /home/node/.claude