import Link from 'next/link';
import { SiteType, SortOrder } from '@/types/article';
import { SITE_UI_CONFIGS } from '@/lib/constants';
import { Button } from '../ui/button';

type Props = {
  activeSite: SiteType;
  searchParams?: {
    order?: SortOrder;
    page?: string;
  };
};

/**
 * サイトフィルターコンポーネント
 * 各サイトでの記事フィルタリング機能を提供
 */
export default function SiteFilter({ activeSite, searchParams = {} }: Props) {
  return (
    <div className='flex flex-wrap gap-2'>
      {Object.entries(SITE_UI_CONFIGS).map(([key, config]) => {
        const isActive = activeSite === key;
        const siteKey = key as SiteType;
        const IconComponent = config.icon;

        return (
          <Link
            key={key}
            href={`?${new URLSearchParams({
              ...searchParams,
              site: siteKey,
              page: '1',
            }).toString()}`}
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
