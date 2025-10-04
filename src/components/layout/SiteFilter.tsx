import Link from 'next/link';
import { SiteType, SortOrder } from '@/types/article';
import { SITE_UI_CONFIGS } from '@/lib/constants';
import { Button } from '../ui/button';
import { createQueryUrl } from '@/lib/url-utils';

type Props = {
  activeSite: SiteType;
  currentSearchParams: {
    site: SiteType;
    order: SortOrder;
    q?: string;
  };
};

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
            href={createQueryUrl({
              site: siteKey,
              order: currentSearchParams.order,
              query: currentSearchParams.q,
            })}
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
