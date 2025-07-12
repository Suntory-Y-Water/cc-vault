import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type SiteType =
  | 'all'
  | 'hatena'
  | 'qiita'
  | 'zenn'
  | 'note'
  | 'docs'
  | 'official';

const siteConfig = {
  all: {
    label: '全サイト',
    color: 'bg-[#E0DFDA] text-[#141413]',
    activeColor: 'bg-[#DB8163] text-[#FAF9F5]',
  },
  hatena: {
    label: 'はてなブックマーク',
    color: 'bg-[#00A4DE] text-white',
    activeColor: 'bg-[#00A4DE] text-white',
  },
  qiita: {
    label: 'Qiita',
    color: 'bg-[#55C500] text-white',
    activeColor: 'bg-[#55C500] text-white',
  },
  zenn: {
    label: 'Zenn',
    color: 'bg-[#3EA8FF] text-white',
    activeColor: 'bg-[#3EA8FF] text-white',
  },
  note: {
    label: 'note',
    color: 'bg-[#41C9B4] text-white',
    activeColor: 'bg-[#41C9B4] text-white',
  },
  official: {
    label: '公式ドキュメント',
    color: 'bg-[#6B46C1] text-white',
    activeColor: 'bg-[#6B46C1] text-white',
  },
};

type Props = {
  activeSite: SiteType;
  searchParams?: {
    order?: 'latest' | 'trending';
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
      {Object.entries(siteConfig).map(([key, config]) => {
        const isActive = activeSite === key;
        const siteKey = key as SiteType;

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
              variant='ghost'
              size='sm'
              className={`h-auto p-0 hover:bg-transparent ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`}
            >
              <Badge
                className={`cursor-pointer transition-colors ${
                  isActive ? config.activeColor : config.color
                }`}
              >
                {config.label}
              </Badge>
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
