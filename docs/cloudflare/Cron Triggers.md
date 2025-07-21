---
title: Cron Triggers
source: https://developers.cloudflare.com/workers/configuration/cron-triggers/
author:
  - "[[Cloudflare Docs]]"
created: 2025-07-21
description: Enable your Worker to be executed on a schedule.
tags:
  - cloudflare
  - cron
image: https://developers.cloudflare.com/dev-products-preview.png
---
[Skip to content](https://developers.cloudflare.com/workers/configuration/cron-triggers/#_top)

## Background

Cron Triggers allow users to map a cron expression to a Worker using a [`scheduled()` handler](https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/) that enables Workers to be executed on a schedule.

Cron Triggers are ideal for running periodic jobs, such as for maintenance or calling third-party APIs to collect up-to-date data. Workers scheduled by Cron Triggers will run on underutilized machines to make the best use of Cloudflare's capacity and route traffic efficiently.

Cron Triggers execute on UTC time.

To respond to a Cron Trigger, you must add a [`"scheduled"` handler](https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/) to your Worker.

- [JavaScript](https://developers.cloudflare.com/workers/configuration/cron-triggers/#tab-panel-2112)
- [TypeScript](https://developers.cloudflare.com/workers/configuration/cron-triggers/#tab-panel-2113)
- [Python](https://developers.cloudflare.com/workers/configuration/cron-triggers/#tab-panel-2114)

```js
export default {
  async scheduled(controller, env, ctx) {
    console.log("cron processed");
  },
};
```

Refer to the following additional examples to write your code:

- [Setting Cron Triggers](https://developers.cloudflare.com/workers/examples/cron-trigger/)
- [Multiple Cron Triggers](https://developers.cloudflare.com/workers/examples/multiple-cron-triggers/)

After you have updated your Worker code to include a `"scheduled"` event, you must update your Worker project configuration.

If a Worker is managed with Wrangler, Cron Triggers should be exclusively managed through the [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/).

Refer to the example below for a Cron Triggers configuration:

- [wrangler.jsonc](https://developers.cloudflare.com/workers/configuration/cron-triggers/#tab-panel-2115)
- [wrangler.toml](https://developers.cloudflare.com/workers/configuration/cron-triggers/#tab-panel-2116)

```jsonc
{
  "triggers": {
    "crons": [
      "*/3 * * * *",
      "0 15 1 * *",
      "59 23 LW * *"
    ]
  }
}
```

You also can set a different Cron Trigger for each [environment](https://developers.cloudflare.com/workers/wrangler/environments/) in your [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/). You need to put the `triggers` array under your chosen environment. For example:

- [wrangler.jsonc](https://developers.cloudflare.com/workers/configuration/cron-triggers/#tab-panel-2119)
- [wrangler.toml](https://developers.cloudflare.com/workers/configuration/cron-triggers/#tab-panel-2120)

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

To add Cron Triggers in the Cloudflare dashboard:

1. Log in to the [Cloudflare dashboard ↗](https://dash.cloudflare.com/) and select your account.
2. In Account Home, select **Workers & Pages**.
3. In **Overview**, select your Worker > **Settings** > **Triggers** > **Cron Triggers**.

Cloudflare supports cron expressions with five fields, along with most [Quartz scheduler ↗](http://www.quartz-scheduler.org/documentation/quartz-2.3.0/tutorials/crontrigger.html#introduction) -like cron syntax extensions:

| Field | Values | Characters |
| --- | --- | --- |
| Minute | 0-59 | \*, - / |
| Hours | 0-23 | \*, - / |
| Days of Month | 1-31 | \*, - / L W |
| Months | 1-12, case-insensitive 3-letter abbreviations ("JAN", "aug", etc.) | \*, - / |
| Weekdays | 1-7, case-insensitive 3-letter abbreviations ("MON", "fri", etc.) | \*, - / L # |

### Examples

Some common time intervals that may be useful for setting up your Cron Trigger:

- `* * * * *`
	- At every minute
- `*/30 * * * *`
	- At every 30th minute
- `45 * * * *`
	- On the 45th minute of every hour
- `0 17 * * sun` or `0 17 * * 1`
	- 17:00 (UTC) on Sunday
- `10 7 * * mon-fri` or `10 7 * * 2-6`
	- 07:10 (UTC) on weekdays
- `0 15 1 * *`
	- 15:00 (UTC) on first day of the month
- `0 18 * * 6L` or `0 18 * * friL`
	- 18:00 (UTC) on the last Friday of the month
- `59 23 LW * *`
	- 23:59 (UTC) on the last weekday of the month

Test Cron Triggers using Wrangler with [`wrangler dev`](https://developers.cloudflare.com/workers/wrangler/commands/#dev). This will expose a `/cdn-cgi/handler/scheduled` route which can be used to test using a HTTP request.

```sh
curl "http://localhost:8787/cdn-cgi/handler/scheduled"
```

To simulate different cron patterns, a `cron` query parameter can be passed in.

```sh
curl "http://localhost:8787/cdn-cgi/handler/scheduled?cron=*+*+*+*+*"
```

Optionally, you can also pass a `time` query parameter to override `controller.scheduledTime` in your scheduled event listener.

```sh
curl "http://localhost:8787/cdn-cgi/handler/scheduled?cron=*+*+*+*+*&time=1745856238"
```

To view the execution history of Cron Triggers, view **Cron Events**:

1. Log in to the [Cloudflare dashboard ↗](https://dash.cloudflare.com/) and select your account.
2. In Account Home, go to **Workers & Pages**.
3. In **Overview**, select your **Worker**.
4. Select **Settings**.
5. Under **Trigger Events**, select **View events**.

Cron Events stores the 100 most recent invocations of the Cron scheduled event. [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs) also records invocation logs for the Cron Trigger with a longer retention period and a filter & query interface. If you are interested in an API to access Cron Events, use Cloudflare's [GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api).

Refer to [Metrics and Analytics](https://developers.cloudflare.com/workers/observability/metrics-and-analytics/) for more information.

To delete a Cron Trigger on a deployed Worker via the dashboard:

1. Log in to the [Cloudflare dashboard ↗](https://dash.cloudflare.com/) and select your account.
2. Go to **Workers & Pages**, and select your Worker.
3. Go to **Triggers** > select the three dot icon next to the Cron Trigger you want to remove > **Delete**.

If a Worker is managed with Wrangler, Cron Triggers should be exclusively managed through the [Wrangler configuration file](https://developers.cloudflare.com/workers/wrangler/configuration/).

When deploying a Worker with Wrangler any previous Cron Triggers are replaced with those specified in the `triggers` array.

- If the `crons` property is an empty array then all the Cron Triggers are removed.
- If the `triggers` or `crons` property are `undefined` then the currently deploy Cron Triggers are left in-place.

- [wrangler.jsonc](https://developers.cloudflare.com/workers/configuration/cron-triggers/#tab-panel-2117)
- [wrangler.toml](https://developers.cloudflare.com/workers/configuration/cron-triggers/#tab-panel-2118)

```jsonc
{
  "triggers": {
    "crons": []
  }
}
```

## Limits

Refer to [Limits](https://developers.cloudflare.com/workers/platform/limits/) to track the maximum number of Cron Triggers per Worker.

## Green Compute

With Green Compute enabled, your Cron Triggers will only run on Cloudflare points of presence that are located in data centers that are powered purely by renewable energy. Organizations may claim that they are powered by 100 percent renewable energy if they have procured sufficient renewable energy to account for their overall energy use.

Renewable energy can be purchased in a number of ways, including through on-site generation (wind turbines, solar panels), directly from renewable energy producers through contractual agreements called Power Purchase Agreements (PPA), or in the form of Renewable Energy Credits (REC, IRECs, GoOs) from an energy credit market.

Green Compute can be configured at the account level:

1. Log in to the [Cloudflare dashboard ↗](https://dash.cloudflare.com/) and select your account.
2. In Account Home, select **Workers & Pages**.
3. In the **Account details** section, find **Compute Setting**.
4. Select **Change**.
5. Select **Green Compute**.
6. Select **Confirm**.
- [Triggers](https://developers.cloudflare.com/workers/wrangler/configuration/#triggers) - Review Wrangler configuration file syntax for Cron Triggers.
- Learn how to access Cron Triggers in [ES modules syntax](https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/) for an optimized experience.