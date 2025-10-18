import type { Client } from '@notionhq/client';

export type NotionClient = Client;

export type NotionDatabaseQueryResult = Awaited<
  ReturnType<NotionClient['dataSources']['query']>
>;

export type NotionPage = NotionDatabaseQueryResult['results'][number];

export type NotionQueryOptions = {
  dataSourceId: string;
  filter?: object;
  sorts?: object[];
  pageSize?: number;
};
