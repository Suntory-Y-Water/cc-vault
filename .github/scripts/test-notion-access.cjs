/**
 * @typedef {import("../types/actions").ActionOptions} ActionOptions
 */

const { Client } = require('@notionhq/client');

/**
 * Notionデータベースへのアクセステストを実行する
 * @param {ActionOptions} options - GitHub Actions のコンテキストオプション
 */
module.exports = async ({ core }) => {
  try {
    const notionToken = process.env.NOTION_TOKEN;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!notionToken) {
      core.setFailed('NOTION_TOKEN環境変数が設定されていません');
      return;
    }

    if (!databaseId) {
      core.setFailed('NOTION_DATABASE_ID環境変数が設定されていません');
      return;
    }

    core.info('Notionクライアントを初期化しています...');
    const notion = new Client({ auth: notionToken });

    core.info(`データソースをクエリしています: ${databaseId}`);
    const response = await notion.dataSources.query({
      data_source_id: databaseId,
      page_size: 5,
    });

    core.info(`正常に ${response.results.length} 件のページを取得しました`);
    core.info('=== データベースクエリ結果 ===');
    core.info(JSON.stringify(response, null, 2));

    if (response.results.length > 0) {
      core.info('✅ Notionアクセステストが成功しました！');
      core.info(`最初のページID: ${response.results[0].id}`);
    } else {
      core.warning('データベースは空ですが、アクセスは成功しました');
    }
  } catch (error) {
    core.setFailed(`Notionアクセスに失敗しました: ${error.message}`);
    if (error.body) {
      core.error(`エラー詳細: ${JSON.stringify(error.body, null, 2)}`);
    }
  }
};
