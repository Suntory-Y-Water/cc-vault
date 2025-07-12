import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー - CC-Vault',
  description: 'CC-Vaultサービスにおける個人情報の取り扱いについて説明します。',
};

/**
 * プライバシーポリシーページコンポーネント
 */
export default function PrivacyPage() {
  return (
    <div className='max-w-4xl mx-auto px-4 py-12'>
      {/* ページタイトル */}
      <div className='text-center mb-12'>
        <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-[#141413] mb-6'>
          プライバシーポリシー
        </h1>
        <p className='text-lg text-[#7D4A38]'>最終更新日: 2025年7月12日</p>
      </div>

      {/* プライバシーポリシー内容 */}
      <div className='prose prose-lg max-w-none'>
        <div className='bg-white/50 rounded-lg p-8 space-y-8'>
          <section>
            <h2 className='text-2xl font-bold text-[#141413] mb-4'>
              1. 基本方針
            </h2>
            <p className='text-[#141413] opacity-80 leading-relaxed'>
              CC-Vault（以下「当サービス」といいます。）は、ユーザーの個人情報の重要性を認識し、個人情報の保護に関する法律（個人情報保護法）を遵守し、適切な取り扱いを実施いたします。
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-[#141413] mb-4'>
              2. 収集する情報
            </h2>
            <p className='text-[#141413] opacity-80 leading-relaxed mb-4'>
              当サービスでは、以下の情報を収集する場合があります。
            </p>
            <div className='space-y-4'>
              <div>
                <h3 className='text-lg font-semibold text-[#141413] mb-2'>
                  2.1 アクセス情報
                </h3>
                <ul className='list-disc list-inside space-y-2 text-[#141413] opacity-80'>
                  <li>IPアドレス</li>
                  <li>ブラウザの種類とバージョン</li>
                  <li>アクセス日時</li>
                  <li>閲覧ページ</li>
                  <li>リファラー情報</li>
                </ul>
              </div>
              <div>
                <h3 className='text-lg font-semibold text-[#141413] mb-2'>
                  2.2 Cookie情報
                </h3>
                <p className='text-[#141413] opacity-80 leading-relaxed'>
                  当サービスでは、ユーザー体験の向上のためにCookieを使用する場合があります。Cookieの使用を望まない場合は、ブラウザの設定で無効にすることができます。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-[#141413] mb-4'>
              3. 情報の利用目的
            </h2>
            <p className='text-[#141413] opacity-80 leading-relaxed mb-4'>
              収集した情報は、以下の目的で利用いたします。
            </p>
            <ul className='list-disc list-inside space-y-2 text-[#141413] opacity-80'>
              <li>当サービスの提供・運営・改善</li>
              <li>利用状況の分析および統計データの作成</li>
              <li>技術的問題の特定と解決</li>
              <li>セキュリティの維持および向上</li>
              <li>不正利用の防止</li>
            </ul>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-[#141413] mb-4'>
              4. 情報の第三者提供
            </h2>
            <p className='text-[#141413] opacity-80 leading-relaxed mb-4'>
              当サービスは、以下の場合を除き、収集した個人情報を第三者に提供することはありません。
            </p>
            <ul className='list-disc list-inside space-y-2 text-[#141413] opacity-80'>
              <li>法令に基づく場合</li>
              <li>人の生命、身体または財産の保護のために必要な場合</li>
              <li>
                公衆衛生の向上または児童の健全な育成の推進のために特に必要な場合
              </li>
              <li>
                国の機関もしくは地方公共団体が法令の定める事務を遂行することに対して協力する必要がある場合
              </li>
            </ul>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-[#141413] mb-4'>
              5. 外部サービスとの連携
            </h2>
            <p className='text-[#141413] opacity-80 leading-relaxed mb-4'>
              当サービスは、記事情報の取得のために以下の外部サービスと連携しています。
            </p>
            <ul className='list-disc list-inside space-y-2 text-[#141413] opacity-80'>
              <li>Zenn（https://zenn.dev/）</li>
              <li>Qiita（https://qiita.com/）</li>
            </ul>
            <p className='text-[#141413] opacity-80 leading-relaxed mt-4'>
              これらのサービスから取得する情報は、各サービスが公開している情報のみであり、個人情報は含まれません。
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-[#141413] mb-4'>
              6. 情報の保存期間
            </h2>
            <p className='text-[#141413] opacity-80 leading-relaxed'>
              収集した情報は、利用目的を達成するために必要な期間に限り保存し、不要になった時点で適切に削除いたします。
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-[#141413] mb-4'>
              7. セキュリティ対策
            </h2>
            <p className='text-[#141413] opacity-80 leading-relaxed'>
              当サービスは、収集した情報の漏洩、滅失または毀損の防止その他の安全管理のために必要かつ適切な措置を講じます。
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-[#141413] mb-4'>
              8. 個人情報に関するお問い合わせ
            </h2>
            <p className='text-[#141413] opacity-80 leading-relaxed'>
              個人情報の取り扱いに関するお問い合わせは、当サービスのお問い合わせ窓口までご連絡ください。適切かつ迅速に対応いたします。
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-[#141413] mb-4'>
              9. プライバシーポリシーの変更
            </h2>
            <p className='text-[#141413] opacity-80 leading-relaxed'>
              当サービスは、法令の変更や事業の変更に伴い、本プライバシーポリシーを変更する場合があります。変更後のプライバシーポリシーは、当サービス上に掲載した時点で効力を生じるものとします。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
