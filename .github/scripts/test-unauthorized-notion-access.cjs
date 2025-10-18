/**
 * @typedef {import("../types/actions").ActionOptions} ActionOptions
 */

const { Client } = require('@notionhq/client');

/**
 * 権限のないデータソースへのアクセスが失敗することを確認するテスト
 * @param {ActionOptions} options - GitHub Actions のコンテキストオプション
 */
module.exports = async ({ core }) => {
  try {
    const notionToken = process.env.NOTION_TOKEN;
    // 意図的に異なるデータソースID（漏洩してもよい公開用データ）
    const unauthorizedDataSourceId = '290779d0-4d02-800e-9112-000b6f6e191c';

    if (!notionToken) {
      core.setFailed('NOTION_TOKEN環境変数が設定されていません');
      return;
    }

    core.info('Notionクライアントを初期化しています...');
    const notion = new Client({ auth: notionToken });

    core.info(
      `権限のないデータソースへのアクセスを試行: ${unauthorizedDataSourceId}`,
    );

    try {
      const response = await notion.dataSources.query({
        data_source_id: unauthorizedDataSourceId,
        page_size: 5,
      });

      // アクセスが成功した場合（想定外）
      core.warning('⚠️ 警告: 権限のないデータソースにアクセスできました');
      core.warning(`取得したページ数: ${response.results.length}`);
      core.setFailed(
        'セキュリティテスト失敗: 権限のないデータソースにアクセスできてしまいました',
      );
    } catch (error) {
      // アクセスが失敗した場合（期待される結果）
      if (error.code === 'object_not_found' || error.code === 'unauthorized') {
        core.info(
          '✅ セキュリティテスト成功: 権限のないデータソースへのアクセスは拒否されました',
        );
        core.info(`エラーコード: ${error.code}`);
        core.info(`エラーメッセージ: ${error.message}`);
      } else {
        // 予期しないエラー
        core.setFailed(`予期しないエラーが発生しました: ${error.message}`);
        if (error.body) {
          core.error(`エラー詳細: ${JSON.stringify(error.body, null, 2)}`);
        }
      }
    }
  } catch (error) {
    core.setFailed(`テスト実行エラー: ${error.message}`);
  }
};
