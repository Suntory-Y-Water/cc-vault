import 'dotenv/config';
import type { Config } from 'drizzle-kit';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
const token = process.env.CLOUDFLARE_D1_TOKEN;

export default {
  schema: './src/config/drizzle/schema.ts',
  out: './src/config/drizzle/migrations',
  driver: 'd1-http',
  dialect: 'sqlite',
  // 環境変数が設定されている場合のみ認証情報を設定
  ...(accountId && databaseId && token
    ? {
        dbCredentials: {
          accountId: accountId,
          databaseId: databaseId,
          token: token,
        },
      }
    : {}),
} satisfies Config;
