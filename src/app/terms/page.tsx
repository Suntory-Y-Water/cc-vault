import type { Metadata } from 'next';
import { getAIAgentFromHeaders } from '@/config/ai-agents';
import { buildThemeStyle } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const aiAgent = await getAIAgentFromHeaders();

  return {
    title: '利用規約',
    description: `${aiAgent.branding.siteName}サービスの利用規約です。ご利用前に必ずお読みください。`,
  };
}

/**
 * 利用規約ページコンポーネント
 */
export default async function TermsPage() {
  const aiAgent = await getAIAgentFromHeaders();
  const themeStyles = buildThemeStyle(aiAgent.colors);

  return (
    <div className='max-w-4xl mx-auto px-4 py-12' style={themeStyles}>
      {/* ページタイトル */}
      <div className='text-center mb-12'>
        <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--ai-text)] mb-6'>
          利用規約
        </h1>
        <p className='text-lg text-[var(--ai-secondary)]'>
          最終更新日: 2025年7月12日
        </p>
      </div>

      {/* 利用規約内容 */}
      <div className='prose prose-lg max-w-none'>
        <div
          className='rounded-lg p-8 space-y-8'
          style={{
            backgroundColor:
              'color-mix(in srgb, var(--ai-background) 90%, white)',
          }}
        >
          <section>
            <h2 className='text-2xl font-bold text-[var(--ai-text)] mb-4'>
              第1条（適用）
            </h2>
            <p className='text-[var(--ai-text)] opacity-80 leading-relaxed'>
              本利用規約（以下「本規約」といいます。）は、
              {aiAgent.branding.siteName}
              （以下「当サービス」といいます。）の利用に関する条件を定めるものです。ユーザーの皆さま（以下「ユーザー」といいます。）には、本規約に従って、当サービスをご利用いただきます。
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-[var(--ai-text)] mb-4'>
              第2条（利用登録）
            </h2>
            <p className='text-[var(--ai-text)] opacity-80 leading-relaxed'>
              当サービスは登録不要でご利用いただけます。当サービスを利用することにより、本規約に同意したものとみなします。
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-[var(--ai-text)] mb-4'>
              第3条（禁止事項）
            </h2>
            <p className='text-[var(--ai-text)] opacity-80 leading-relaxed mb-4'>
              ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません。
            </p>
            <ul className='list-disc list-inside space-y-2 text-[var(--ai-text)] opacity-80'>
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>
                当サービスの内容等、当サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為
              </li>
              <li>当サービスの運営を妨害するおそれのある行為</li>
              <li>不正アクセスをし、またはこれを試みる行為</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-[var(--ai-text)] mb-4'>
              第4条（当サービスの提供の停止等）
            </h2>
            <p className='text-[var(--ai-text)] opacity-80 leading-relaxed'>
              当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく当サービスの全部または一部の提供を停止または中断することができるものとします。
            </p>
            <ul className='list-disc list-inside space-y-2 text-[var(--ai-text)] opacity-80 mt-4'>
              <li>
                当サービスにかかるコンピュータシステムの保守点検または更新を行う場合
              </li>
              <li>
                地震、落雷、火災、停電または天災などの不可抗力により、当サービスの提供が困難となった場合
              </li>
              <li>コンピュータまたは通信回線等が事故により停止した場合</li>
              <li>その他、当社が当サービスの提供が困難と判断した場合</li>
            </ul>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-[var(--ai-text)] mb-4'>
              第5条（著作権・知的財産権）
            </h2>
            <p className='text-[var(--ai-text)] opacity-80 leading-relaxed'>
              当サービスで提供する記事情報は、各プラットフォーム（Zenn、Qiita等）の公開APIまたは公開された情報を基に収集しており、各記事の著作権は原著者に帰属します。当サービスは情報の集約・表示のみを行い、記事の内容自体の権利を主張するものではありません。
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-[var(--ai-text)] mb-4'>
              第6条（免責事項）
            </h2>
            <p className='text-[var(--ai-text)] opacity-80 leading-relaxed'>
              当社は、当サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-[var(--ai-text)] mb-4'>
              第7条（サービス内容の変更等）
            </h2>
            <p className='text-[var(--ai-text)] opacity-80 leading-relaxed'>
              当社は、ユーザーに通知することなく、当サービスの内容を変更しまたは当サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-[var(--ai-text)] mb-4'>
              第8条（利用規約の変更）
            </h2>
            <p className='text-[var(--ai-text)] opacity-80 leading-relaxed'>
              当社は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、当サービスの利用を継続したユーザーは、変更後の規約に同意したものとみなします。
            </p>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-[var(--ai-text)] mb-4'>
              第9条（準拠法・裁判管轄）
            </h2>
            <p className='text-[var(--ai-text)] opacity-80 leading-relaxed'>
              本規約の解釈にあたっては、日本国の法律を準拠法とします。当サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
