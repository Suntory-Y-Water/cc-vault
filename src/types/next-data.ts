/**
 * ZennのトピックページのNEXT_DATA型
 */
export type ZennTopics = {
  readonly props: Props;
};

type Props = {
  readonly pageProps: PageProps;
};

type PageProps = {
  readonly currentPage: number;
  readonly articles: Article[];
  readonly nextPage: number;
};

type Article = {
  readonly id: number;
  readonly title: string;
  readonly likedCount: number;
  readonly bookmarkedCount: number;
  readonly publishedAt: string;
  readonly path: string;
  readonly user: User;
};

type User = {
  readonly id: number;
  readonly username: string;
  readonly name: string;
};

/**
 * Zennの記事ページのNEXT_DATA型
 */
export type ZennArticle = {
  readonly props: ArticleProps;
};

type ArticleProps = {
  readonly pageProps: ArticlePageProps;
};

type ArticlePageProps = {
  readonly article: ArticleDetail;
  readonly user: PurpleUser;
};

type ArticleDetail = {
  readonly id: number;
  readonly title: string;
  readonly likedCount: number;
  readonly bookmarkedCount: number;
  readonly publishedAt: string;
  readonly path: string;
  readonly bodyHTML: string;
  readonly ogImageURL: string;
};

type PurpleUser = {
  readonly id: number;
  readonly username: string;
  readonly name: string;
};
