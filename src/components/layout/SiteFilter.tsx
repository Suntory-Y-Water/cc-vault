import Link from 'next/link';
import { SiteType, SortOrder } from '@/types/article';
import { SITE_UI_CONFIGS } from '@/lib/constants';
import { Button } from '../ui/button';

type Props = {
  activeSite: SiteType;
  currentSearchParams: {
    site: SiteType;
    order: SortOrder;
  };
};

/**
 * クエリパラメータを作成する
 * @param site - 選択したサイト
 * @param currentOrder - 現在のソート順
 * @returns URLクエリパラメータ文字列
 */
function createSiteFilterUrl(site: SiteType, currentOrder: SortOrder): string {
  const params = new URLSearchParams();
  
  if (site !== 'all') {
    params.set('site', site);
  }
  
  if (currentOrder !== 'latest') {
    params.set('order', currentOrder);
  }
  
  const queryString = params.toString();
  return queryString ? `/?${queryString}` : '/';
}

/**
 * サイトフィルターコンポーネント
 * RSCでLinkベースのフィルタリング機能を提供
 */
export default function SiteFilter({ activeSite, currentSearchParams }: Props) {
  return (
    <div className='flex flex-wrap gap-2'>
      {Object.entries(SITE_UI_CONFIGS).map(([key, config]) => {
        const isActive = activeSite === key;
        const siteKey = key as SiteType;
        const IconComponent = config.icon;

        return (
          <Link
            key={key}
            href={createSiteFilterUrl(siteKey, currentSearchParams.order)}
            prefetch={true}
          >
            <Button
              type='button'
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer transform hover:scale-105 ${
                isActive ? config.activeStyle : config.baseStyle
              }`}
            >
              <IconComponent className='w-4 h-4' />
              {config.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
