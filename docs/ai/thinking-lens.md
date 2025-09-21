# 思考のレンズ

## 前提 (Premise)
- パッケージマネージャーは **pnpm** に統一する  
- 開発は Dev Containers 上で行い、ホスト環境には依存させない  
- MCP 連携に必要なツールは **bun / codex / uv / serena / claude-code** を明記してインストールする  
- セキュリティインシデント回避のため、依存解決は lockfile 固定と整合性検証を行う  
- 非rootユーザーで運用し、環境は再現可能であることを保証する  

## 状況 (Situation)
- 2025-09-20 現在、npm 経由のサプライチェーン攻撃が散発している  
- 生成AIの誤動作や誤指示による `rm -rf` 等の破壊的操作をホストから隔離する必要がある  
- プロジェクトは TypeScript が中心だが、MCP ツール群の導入も必須である  
- 現行の devcontainer 設定では wrangler 等不要な要素が含まれ、MCP連携の明記が不足している  
- forwardPorts は 3000/5173/8787 のみだが、他ポートも利用される可能性がある  

## 目的 (Purpose)
- **TypeScript プロジェクト共通で利用できる devcontainer 設定を完成させる**  
- MCP ツール（bun / codex / uv / serena / claude-code）を明示的にサポートする  
- セキュリティ・再現性・利便性のバランスをとり、オンボーディングを短縮する  
- ホスト環境を汚さず、開発チーム全員が同じ環境で作業できるようにする  

## 動機 (Motive)
- npm 由来のマルウェアから影響を最小化し、依存インシデント時の復旧を容易にするため  
- 生成AI利用時にホスト環境を破壊しないため  
- プロジェクト横断で統一された環境を持つことでメンテナンス性を高めるため  
- 新規メンバーが即座に開発に参加できるようにするため  

## 制約 (Constraint)
- パッケージ管理は pnpm 固定（npm/yarnは禁止）  
- lockfile を必須とし、`--frozen-lockfile` を既定で利用する  
- `verify-store-integrity` や `minimum-release-age` を設定し、依存取得の健全性を担保する  
- MCP サーバ設定は `~/.claude/mcp/servers.json` に明示的に定義する  
- 非rootユーザーで動作させる（remoteUser=node）  
- forwardPorts 3000/5173/8787 を既知ポートとして確保し、その他は `otherPortsAttributes` で自動検出  