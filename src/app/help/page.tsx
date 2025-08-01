import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, Filter, TrendingUp, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ヘルプセンター - CC-Vault',
  description:
    'CC-Vaultの使い方や機能について、よくある質問と回答をまとめました。',
};

/**
 * ヘルプセンターページコンポーネント
 */
export default function HelpPage() {
  const faqs = [
    {
      category: '基本的な使い方',
      icon: HelpCircle,
      questions: [
        {
          q: 'CC-Vaultとは何ですか？',
          a: 'CC-VaultはClaudeCode関連の技術記事を複数のプラットフォームから自動収集し、一箇所で閲覧できるキュレーションサービスです。ZennやQiitaなどの記事を効率的にチェックできます。',
        },
        {
          q: '利用料金はかかりますか？',
          a: 'CC-Vaultは完全無料でご利用いただけます。会員登録も不要で、どなたでもすぐにご利用開始いただけます。',
        },
        {
          q: 'どのようなサイトの記事を収集していますか？',
          a: '現在、Zenn、QiitaからClaudeCode関連の記事を収集しています。今後、対応サイトを拡充予定です。',
        },
      ],
    },
    {
      category: 'フィルタリング機能',
      icon: Filter,
      questions: [
        {
          q: 'サイト別フィルタリングの使い方を教えてください',
          a: 'ページ上部のフィルターボタン（すべて、Zenn、Qiita）をクリックすることで、特定のサイトの記事のみを表示できます。',
        },
        {
          q: '「すべて」フィルターは何を表示しますか？',
          a: '「すべて」フィルターは、収集している全サイトの記事を横断して表示します。最新のトレンドを幅広く確認したい場合におすすめです。',
        },
      ],
    },
    {
      category: 'ソート機能',
      icon: TrendingUp,
      questions: [
        {
          q: '「新着順」と「トレンド順」の違いは何ですか？',
          a: '「新着順」は投稿日時の新しい順に表示し、「トレンド順」はいいね数やブックマーク数などのエンゲージメント指標を基に人気順で表示します。',
        },
        {
          q: 'トレンド順の計算方法を教えてください',
          a: 'トレンド順は、いいね数とブックマーク数の合計値を基に算出しています。より多くの反響があった記事が上位に表示されます。',
        },
      ],
    },
    {
      category: 'その他',
      icon: Clock,
      questions: [
        {
          q: '記事の更新頻度はどの程度ですか？',
          a: '記事は1時間ごとに自動更新されており、常に最新の情報をご確認いただけます。',
        },
        {
          q: 'モバイルデバイスでも利用できますか？',
          a: 'はい、CC-Vaultはレスポンシブデザインに対応しており、スマートフォンやタブレットでも快適にご利用いただけます。',
        },
        {
          q: '記事が表示されない場合はどうすればよいですか？',
          a: 'ページを再読み込みしていただくか、しばらく時間をおいてから再度アクセスしてください。',
        },
      ],
    },
  ];

  return (
    <div className='max-w-[80rem] mx-auto px-4 py-12'>
      {/* ページタイトル */}
      <div className='text-center mb-12'>
        <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-[#141413] mb-6'>
          ヘルプセンター
        </h1>
        <p className='text-lg text-[#7D4A38] max-w-2xl mx-auto'>
          CC-Vaultの使い方や機能について、よくある質問と回答をまとめました。
          ご不明な点がございましたら、以下をご確認ください。
        </p>
      </div>

      {/* FAQ一覧 */}
      <div className='space-y-8'>
        {faqs.map((category, _categoryIndex) => {
          const IconComponent = category.icon;
          return (
            <div key={category.category}>
              <div className='flex items-center gap-3 mb-6'>
                <IconComponent className='w-6 h-6 text-[#DB8163]' />
                <h2 className='text-2xl font-bold text-[#141413]'>
                  {category.category}
                </h2>
              </div>
              <div className='grid gap-4'>
                {category.questions.map((faq, faqIndex) => (
                  <Card
                    key={`${category.category}-${faqIndex}`}
                    className='bg-[#FAF9F5] border-[#E0DFDA] hover:shadow-lg transition-shadow duration-200'
                  >
                    <CardContent className='p-6'>
                      <h3 className='text-lg font-semibold text-[#141413] mb-3'>
                        Q. {faq.q}
                      </h3>
                      <p className='text-[#141413] opacity-80 leading-relaxed'>
                        A. {faq.a}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
