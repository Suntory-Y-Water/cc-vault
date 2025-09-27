import type { Env as WorkerEnv } from '../../cloudflare-env';

declare module 'cloudflare:test' {
  interface ProvidedEnv extends WorkerEnv {
    DB: D1Database;
  }
}
