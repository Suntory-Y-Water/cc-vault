---
title: Multiple Cron Triggers
source: https://developers.cloudflare.com/workers/examples/multiple-cron-triggers/
author:
  - "[[Cloudflare Docs]]"
created: 2025-07-21
description: Set multiple Cron Triggers on three different schedules.
tags:
  - cloudflare
  - cron
image: https://developers.cloudflare.com/dev-products-preview.png
---
[Skip to content](https://developers.cloudflare.com/workers/examples/multiple-cron-triggers/#_top)

If you want to get started quickly, click on the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/docs-examples/tree/main/workers/multiple-cron-triggers)

This creates a repository in your GitHub account and deploys the application to Cloudflare Workers.

- [JavaScript](https://developers.cloudflare.com/workers/examples/multiple-cron-triggers/#tab-panel-2418)
- [TypeScript](https://developers.cloudflare.com/workers/examples/multiple-cron-triggers/#tab-panel-2419)
- [Hono](https://developers.cloudflare.com/workers/examples/multiple-cron-triggers/#tab-panel-2420)

```js
export default {
  async scheduled(event, env, ctx) {
    // Write code for updating your API
    switch (event.cron) {
      case "*/3 * * * *":
        // Every three minutes
        await updateAPI();
        break;
      case "*/10 * * * *":
        // Every ten minutes
        await updateAPI2();
        break;
      case "*/45 * * * *":
        // Every forty-five minutes
        await updateAPI3();
        break;
    }
    console.log("cron processed");
  },
};
```

The recommended way of testing Cron Triggers is using Wrangler.

Cron Triggers can be tested using Wrangler by passing in the `--test-scheduled` flag to [`wrangler dev`](https://developers.cloudflare.com/workers/wrangler/commands/#dev). This will expose a `/__scheduled` (or `/cdn-cgi/handler/scheduled` for Python Workers) route which can be used to test using a HTTP request. To simulate different cron patterns, a `cron` query parameter can be passed in.

```sh
npx wrangler dev --test-scheduled

curl "http://localhost:8787/__scheduled?cron=*%2F3+*+*+*+*"

curl "http://localhost:8787/cdn-cgi/handler/scheduled?cron=*+*+*+*+*" # Python Workers
```