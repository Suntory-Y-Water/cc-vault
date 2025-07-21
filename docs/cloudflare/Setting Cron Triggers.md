---
title: Setting Cron Triggers
source: https://developers.cloudflare.com/workers/examples/cron-trigger/
author:
  - "[[Cloudflare Docs]]"
created: 2025-07-21
description: Set a Cron Trigger for your Worker.
tags:
  - cloudflare
  - cron
image: https://developers.cloudflare.com/dev-products-preview.png
---
[Skip to content](https://developers.cloudflare.com/workers/examples/cron-trigger/#_top)

If you want to get started quickly, click on the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/docs-examples/tree/main/workers/cron-trigger)

This creates a repository in your GitHub account and deploys the application to Cloudflare Workers.

- [JavaScript](https://developers.cloudflare.com/workers/examples/cron-trigger/#tab-panel-2358)
- [TypeScript](https://developers.cloudflare.com/workers/examples/cron-trigger/#tab-panel-2359)
- [Python](https://developers.cloudflare.com/workers/examples/cron-trigger/#tab-panel-2360)
- [Hono](https://developers.cloudflare.com/workers/examples/cron-trigger/#tab-panel-2361)

```js
export default {
  async scheduled(controller, env, ctx) {
    console.log("cron processed");
  },
};
```

Refer to [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/) for more information on how to add a Cron Trigger.

If you are deploying with Wrangler, set the cron syntax (once per hour as shown below) by adding this to your Wrangler file:

- [wrangler.jsonc](https://developers.cloudflare.com/workers/examples/cron-trigger/#tab-panel-2362)
- [wrangler.toml](https://developers.cloudflare.com/workers/examples/cron-trigger/#tab-panel-2363)

```jsonc
{
  "name": "worker",
  "triggers": {
    "crons": [
      "0 * * * *"
    ]
  }
}
```

You also can set a different Cron Trigger for each [environment](https://developers.cloudflare.com/workers/wrangler/environments/) in your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/). You need to put the `[triggers]` table under your chosen environment. For example:

- [wrangler.jsonc](https://developers.cloudflare.com/workers/examples/cron-trigger/#tab-panel-2364)
- [wrangler.toml](https://developers.cloudflare.com/workers/examples/cron-trigger/#tab-panel-2365)

```jsonc
{
  "env": {
    "dev": {
      "triggers": {
        "crons": [
          "0 * * * *"
        ]
      }
    }
  }
}
```

The recommended way of testing Cron Triggers is using Wrangler.

Cron Triggers can be tested using Wrangler by passing in the `--test-scheduled` flag to [`wrangler dev`](https://developers.cloudflare.com/workers/wrangler/commands/#dev). This will expose a `/__scheduled` (or `/cdn-cgi/handler/scheduled` for Python Workers) route which can be used to test using a HTTP request. To simulate different cron patterns, a `cron` query parameter can be passed in.

```sh
npx wrangler dev --test-scheduled

curl "http://localhost:8787/__scheduled?cron=0+*+*+*+*"

curl "http://localhost:8787/cdn-cgi/handler/scheduled?cron=*+*+*+*+*" # Python Workers
```