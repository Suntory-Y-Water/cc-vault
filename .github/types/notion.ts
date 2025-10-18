import type { Client } from '@notionhq/client';

export type NotionClient = Client;

export type NotionDataSourceQueryResult = Awaited<
  ReturnType<NotionClient['dataSources']['query']>
>;

export type NotionPage = NotionDataSourceQueryResult['results'][number];

export type NotionQueryOptions = {
  dataSourceId: string;
  filter?: object;
  sorts?: object[];
  pageSize?: number;
};
