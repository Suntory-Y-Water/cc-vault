import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const execAsync = promisify(exec);

// ESモジュールでの __dirname の代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 本番環境のD1データベースをバックアップする
 * バックアップファイルは日時付きでプロジェクトルートに保存される
 */
async function backupProduction() {
  try {
    // タイムスタンプ付きファイル名生成
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '')
      .replace('T', '-');

    const backupFileName = `production-backup-${timestamp}.sql`;
    const backupPath = path.resolve(__dirname, '..', backupFileName);

    console.log('本番環境データベースのバックアップを開始します...');
    console.log(`バックアップファイル: ${backupFileName}`);

    // wrangler d1 export を実行（本番環境）
    const command = `wrangler d1 export DB --remote --output="${backupPath}"`;

    console.log('実行コマンド:', command);

    const { stdout, stderr } = await execAsync(command);

    if (stderr && !stderr.includes('NOTICE:')) {
      console.error('警告:', stderr);
    }

    if (stdout) {
      console.log('出力:', stdout);
    }

    console.log(`✅ バックアップが完了しました: ${backupFileName}`);
    console.log(`\n復元方法:`);
    console.log(`wrangler d1 execute DB --remote --file="${backupFileName}"`);
  } catch (error) {
    console.error('❌ バックアップ中にエラーが発生しました:', error);
    process.exit(1);
  }
}

// ESモジュールでのメインモジュール判定
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  backupProduction()
    .then(() => console.log('完了'))
    .catch((err) => {
      console.error('エラー:', err);
      process.exit(1);
    });
}

export { backupProduction };
