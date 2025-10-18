We’ve released **Notion API version `2025‑09‑03`**, introducing first-class support for multi-source databases. This enables a single database to contain multiple linked data sources — unlocking powerful new workflows.

For more information about data sources, see [our FAQs.](https://developers.notion.com/docs/upgrade-faqs-2025-09-03)

**However, this change is not backwards-compatible.** Most existing database integrations must be updated to prevent disruptions.

> ## ❗️Code changes required
> 
> If your integration is still using a previous API version and a user adds another data source to a database, **the following API actions will fail:**
> 
> - Create page when using the database as the parent
> - Database read, write, or query
> - Writing relation properties that point to that database

## What’s changing

- Most API operations that used `database_id` now require a `data_source_id`
- Several database endpoints have moved or been restructured to support the new data model
- A breakdown of what’s new and why it changed
- A step-by-step migration checklist to safely update your integrations

## Upgrade checklist

Use this checklist to see exactly what must change before you bump Notion-Version to `2025-09-03`.

1. Add a discovery step to fetch and store the `data_source_id` to use in subsequent API calls.
2. Start sending `data_source_id` when creating pages or defining relations
3. Migrate database endpoints to data sources.
4. If you use the Search API, update result handling to process data source objects and possible multiple results per database
5. If using the TypeScript SDK, upgrade to the correct version and set the new version in your client
6. If using webhooks, handle the new shape and bump your subscription version

> ## 📘Developer action required
> 
> These steps primarily require code changes in your repositories or low-code platform. They cannot be fully completed through the Notion integration management UI.

## Step-by-step guide

First, identify the parts of your system that process database IDs. These may include:

- Responses of list and search APIs, e.g. [Search](https://developers.notion.com/reference/search).
- Database IDs provided directly by users of your system, or hard-coded based on URLs in the Notion app.
- Events for integration webhooks (covered in the **Webhook changes** section below).

For each entry point that uses database IDs, start your migration process by introducing an API call to the new **Get Database API** (`GET /v1/databases/:database_id`) endpoint to retrieve a list of child `data_sources`. For this new call, make sure to use the `2025-09-03` version in the `Notion-Version` header, even if the rest of your API calls haven't been updated yet.

To get a data source ID in the Notion app, the settings menu for a database includes a "Copy data source ID" button under "Manage data sources":

![](https://files.readme.io/f2d0303a35d08c014d2ed7a171994fe410a8bd5a5b47706fe4b340a161d38c20-image.png)

Having access to the data source ID (or rather, *IDs*, once Notion users start adding 2nd sources for their existing databases) for a database lets you continue onto the next few steps.

Some APIs that accept `database_id` in the body parameters now support providing a specific `data_source_id` instead. This works for any API version, meaning you can switch over at your convenience, before or after upgrading these API requests to use `2025-09-03`:

- Creating a page with a database (now: data source) parent
- Defining a database relation property that points to another database (now: data source)

### Create page

In the [Create a page](https://developers.notion.com/reference/post-page) API, look for calls that look like this:

Change these to use `data_source_id` parents instead, using the code from Step 1 to get the ID of a database's data source:

For [database relation properties](https://developers.notion.com/reference/property-object#relation), the API will include both a `database_id` and `data_source_id` fields in the read path instead of just a `database_id`.

In the write path, switch your integration to only provide the `data_source_id` in request objects.

Note that [database mentions](https://developers.notion.com/reference/rich-text#database-mention-type-object) in rich text will continue to reference the database, not the data source.

The next step is to migrate each existing use of database APIs to their new data source equivalents, taking into account the differences between the old `/v1/databases` APIs and new `/v1/data_sources` APIs:

- Return very similar responses, but with `object: "data_source"`, starting from `2025-09-03`
- Accept a specific **data source ID** in query, body, and path parameters, not a database ID
- Exist under the `/v1/data_sources` namespace, starting from version `2025-09-03`
	- Require a custom API request with `notion.request` if you're using the TypeScript SDK, since we won't upgrade to SDK v5 until you get to Step 4 (below).

The following APIs are affected. Each of them is covered by a sub-section below, with more specific Before vs. After explanations and code snippets:

- [Retrieve a database](https://developers.notion.com/reference/retrieve-a-database)
- [Query a database](https://developers.notion.com/reference/post-database-query)
- [Create a database](https://developers.notion.com/reference/create-a-database)
- [Update a database](https://developers.notion.com/reference/update-a-database)
- [Search](https://developers.notion.com/reference/search)

### Retrieve database

**Before (2022-06-28):**

- Retrieving a database with multiple data sources fails with a `validation_error` message.
- **For relation properties**: across *all* API versions, *both* the `database_id` and `data_source_id` are now included in the response object.

**After (2025-09-03):**

- The Retrieve Database API is now repurposed to return a list of `data_sources` (each with an `id` and `name`, as described in Step 1).
- The Retrieve *Data Source* API is the new home for getting up-to-date information on the properties (schema) of each data source under a database.
	- The `object` field is always `"data_source"` and the `id` is specific to the data source.
	- The `parent` object now identifies the `database_id` immediate parent of the data source.
	- The database's parent (i.e. the data source's grandparent) is included as a separate field, `database_parent`, on the data source response.
	- You can't use a database ID with the retrieve data source API, or vice-versa. The two types of IDs are not interchangeable.

### Query databases

**Before (2022-06-28):**

**After (2025-09-03):**

When you update the API version, the path of this API changes, and now accepts a data source ID. With the TS SDK, you'll have to switch this to temporarily use a custom `notion.request(...)`, until you upgrade to the next major version as part of Step 4.

### Create database

**Before (2022-06-28):**

- In `2022-06-28`, the Create Database API created a database and data source, along with its initial default view.
- **For relation properties**: across *all* API versions, *both* the `database_id` and `data_source_id` are now included in the response object.
	- When providing relation properties in a request, you can either use `database_id`, `data_source_id`, or both, prior to making the API version upgrade.
	- We recommend starting by switching your integration over to passing only a `data_source_id` for relation objects even in `2022-06-28` to precisely identify the data source to use for the relation and be ready for the `2025-09-03` behavior.

**After (2025-09-03):**

- Continue to use the Create Database API even after upgrading, when you want to create both a database and its initial data source.
	- `properties` for the initial data source you're creating now go under `initial_data_source[properties]` to better separate data source specific properties vs. ones that apply to the entire database.
	- Other parameters apply to the database and continue to be specified at the top-level when creating a database (`icon`, `cover`, `title`).
- Only use the new Create Data Source API to add an additional data source (with a new set of `properties`) to an existing database.
- **For relation properties**: You can no longer provide a `database_id`. Notion continues to include both the `database_id` and `data_source_id` in the *response* for convenience, but the *request* object must **only contain `data_source_id`**.

### Update database

**Before (2022-06-28):**

- In `2022-06-28`, the Update Database API was used to update attributes that related to both a database and its data source under the hood. For example, `is_inline` relates to the database, but `properties` defines the schema of a specific data source.
- **For relation properties**: across *all* API versions, *both* the `database_id` and `data_source_id` are now included in the response object.
	- When providing relation properties in a request, you can either use `database_id`, `data_source_id`, or both, prior to making the API version upgrade.
	- We recommend starting by switching your integration over to passing only a `data_source_id` for relation objects even in `2022-06-28` to precisely identify the data source to use for the relation and be ready for the `2025-09-03` behavior.

**After (2025-09-03):**

- Continue to use the Update Database API for attributes that apply to the database: `parent`, `title`, `is_inline`, `icon`, `cover`, `in_trash`.
	- `parent` can be used to move an existing database to a different page, or (for public integrations), to the workspace level as a private page. This is a new feature in Notion's API.
	- `cover` is not supported when `is_inline` is `true`.
- Switch over to the Update *Data Source* API to modify attributes that apply to a specific data source: `properties` (to change database schema), `in_trash` (to archive or unarchive a specific data source under a database), `title`.
	- Changes to one data source's `properties` doesn't affect the schema for other data source, even if they share a common database.
	- **For relation properties**: You can no longer provide a `database_id`. Notion continues to include both the `database_id` and `data_source_id` in the *response* for convenience, but the *request* object (to Update Data Source) must **only contain `data_source_id`**.

Example for updating a data source's title and properties (adding one new property and removing another):

Example for updating a database's parent (to move it), and switch it to be inline under the parent page:

**Before (2022-06-28):**

- If any Notion users add a second data source to a database, existing integrations will not see any search results for that database.

**After (2025-09-03):**

- The [Search](https://developers.notion.com/reference/search) API now only accepts `filter["value"] = "page" | "data_source"` instead of `"page" | "database"` when providing a `filter["type"] = "object"`. Make sure to update the body parameters accordingly when upgrading to `2025-09-03`.
	- Currently, the search behavior remains the same. The provided query is matched against the *database* title, not the *data source* title.
- Similarly, the search API *response* returns data source IDs & objects.
	- Aside from the IDs and `object: "data_source"` in these entries, the rest of the object shape of search is unchanged.
	- Since results operate at the data source level, they continue to include `properties` (database schema) as before.
	- If there are multiple data sources, all of them are included in the search response. Each of them will have a different data source ID.

> ## 📘Introducing @notionhq/client v5
> 
> v5 of the SDK is now available:
> 
> - [NPM link](https://www.npmjs.com/package/@notionhq/client/v/5.0.0)
> 
> If you see an even newer version (e.g. `v5.0.2`) at the time you're following these steps, we recommend upgrading directly to the latest version to unlock more enhancements and bugfixes, making the upgrade smoother.

If you're using [Notion's TypeScript SDK](https://github.com/makenotion/notion-sdk-js), and have completed all of the steps above to rework your usage of Notion's endpoints to fit the `2025-09-03` suite of endpoints manually, we recommend completing the migration by upgrading to the next [major version release](https://github.com/makenotion/notion-sdk-js/releases), v5.0.0, via your `package.json` file (or other version management toolchain.)

The code snippets under Step 3 include the relevant syntax for the new `notion.dataSources.*` and `notion.databases.*` methods to assist in your upgrade. Go through each area where you used a manual `notion.request(...)` call, and switch it over to use one of the dedicated methods. Make sure you're setting the Notion version at initialization time to `2025-09-03`.

Note that the [List databases (deprecated)](https://developers.notion.com/reference/get-databases) endpoint, which has been removed since version `2022-02-22`, is no longer included as of v5 of the SDK.

When creating, editing, or viewing an [integration webhook subscription](https://developers.notion.com/reference/webhooks) in Notion's integration settings, there's a new option to set the **API version** that applies to events delivered to your webhook URL:

![Screenshot of the integration webhook "Edit subscription" form, with the new "API version" dropdown menu.](https://files.readme.io/dea8af87f7abbb9f51a0cce55aa59a6087fb3641376471a2168d4636c84f8a9e-image.png)

Screenshot of the integration webhook "Edit subscription" form, with the new "API version" dropdown menu.

For new webhook endpoints, we recommend starting with the most recent version. For existing webhook subscriptions, you'll need to carefully introduce support for the added and changed webhook types. Ensure your webhook handler can accept *both* old & new event payloads before using the " **Edit subscription** " form to upgrade to the `2025-09-03` API version.

After you've tested your webhook endpoint to ensure the new events are being handled correctly for some period of time (for example, a few hours), you can clean up your system to only expect events with the updated shape. Read on below for specific details on what's changed in `2025-09-03`.

New `data_source` specific events have been added, and the corresponding existing `database` events now apply at the **database** level.

Here's a breakdown of how [event types](https://developers.notion.com/reference/webhooks-events-delivery) change names or behavior when upgraded to `2025-09-03`:

| Old Name | New Name | Description |
| --- | --- | --- |
| `database.content_updated` | `data_source.content_updated` | Data source's content updates |
| `database.schema_updated` | `data_source.schema_updated` | Data source's schema updates |
| N/A (new event) | `data_source.created` | New data source is added to an existing database      `entity.type` is `"data_source"` |
| N/A (new event) | `data_source.moved` | Data source is moved to a different database      `entity.type` is `"data_source"` |
| N/A (new event) | `data_source.deleted` | Data source is deleted from a database      `entity.type` is `"data_source"` |
| N/A (new event) | `data_source.undeleted` | Data source is undeleted      `entity.type` is `"data_source"` |
| `database.created` | (unchanged) | New database is created with a default data source |
| `database.moved` | (unchanged) | Database is moved to different parent (i.e. page) |
| `database.deleted` | (unchanged) | Database is deleted from its parent |
| `database.undeleted` | (unchanged) | Database is undeleted |

With the `2025-09-03` version, all webhooks for entities that can have data sources as parents now include a new field `data_source_id` under the `data.parent` object.

This applies to:

- Page events (`page.*`)
- Data source events (the `data_source.*` ones listed above)
- Database events (`database.*`), but **only** in rarer cases where databases are directly parented by another database (i.e. wikis)

For example, when a Notion user creates a page within a data source using the Notion app, the resulting `page.created` event has the following example shape (note the new `data.parent.data_source_id` field):

For compatibility with multi-source databases, use the provided `parent.data_source_id` to distinguish which data source the page lives in.

---

Did this page help you?