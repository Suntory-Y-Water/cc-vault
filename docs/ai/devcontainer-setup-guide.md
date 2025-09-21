# 開発コンテナ設定ガイド

## 概要

thinking-lens.mdの要件に基づき、TypeScriptプロジェクト共通で利用できるdev container設定を完成させました。

## 実装済み内容

### 1. Dockerfile、devcontainer.jsonの修正

- **bunのインストール**: MCP連携のために追加
- **uvのインストール**: serena MCP サーバー実行のために追加
- 両ツールとも開発時専用のため、Dockerfileで事前インストール

### 2. devcontainer.json更新

- **otherPortsAttributes設定追加**:
  - `"onAutoForward": "notify"` により、3000/5173/8787以外のポートも自動検出・通知

## 設定の効果

- **MCP連携対応**: .mcp.jsonで定義されたserenaサーバーがuvx経由で動作可能
- **bun対応**: MCPや他のツールでbunが必要な場合に利用可能
- **ポート管理改善**: 既知ポート以外も自動検出し、開発効率向上

## 次回以降の課題

- Claude Code設定の永続化マウント（具体的実装方法調査後）
- Codex設定の永続化マウント（具体的実装方法調査後）
- pnpmセキュリティ強化設定の詳細実装

## 使用方法

1. コンテナをリビルド: `Dev Containers: Rebuild Container`
2. .mcp.jsonで定義されたMCPサーバーが自動で利用可能
3. 新しいポートが使用される場合、VS Codeが自動通知