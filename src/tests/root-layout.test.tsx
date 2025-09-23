import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseHTML } from 'linkedom';

const headersMock = vi.fn();
const headerPropsSpy = vi.fn();

vi.mock('next/headers', () => ({
  headers: headersMock,
}));

vi.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'mocked-inter',
  }),
}));

vi.mock('@/components/common/StructuredData', () => ({
  default: () => <div data-testid='structured-data' />,
}));

vi.mock('@/components/layout/Header', () => ({
  __esModule: true,
  default: (props: {
    branding: { siteName: string; tagline?: string | undefined };
  }) => {
    headerPropsSpy(props);
    return (
      <header
        data-testid='header'
        data-site-name={props.branding.siteName}
        data-tagline={props.branding.tagline ?? ''}
      />
    );
  },
}));

vi.mock('@/components/layout/Footer', () => ({
  default: () => <footer data-testid='footer' />,
}));

function mockHeaders(host: string | null) {
  return {
    get: vi.fn((key: string) => (key.toLowerCase() === 'host' ? host : null)),
  } satisfies {
    get: (key: string) => string | null;
  };
}

function extractBodyStyle(markup: string) {
  const styleMatch = markup.match(/<body[^>]*style="([^"]*)"/);
  return styleMatch ? styleMatch[1] : null;
}

describe('RootLayout', () => {
  beforeEach(() => {
    headersMock.mockReset();
    headerPropsSpy.mockReset();
  });

  it.skip('ホスト名から識別されたAIエージェントテーマをdata属性とCSSカスタムプロパティで適用する', async () => {
    headersMock.mockReturnValue(mockHeaders('codex.example.com'));

    const RootLayout = (await import('../app/layout')).default;
    const markup = renderToStaticMarkup(
      await RootLayout({ children: <div>content</div> }),
    );
    const { document } = parseHTML(markup);
    const bodyStyle = extractBodyStyle(markup);

    expect(headersMock).toHaveBeenCalledOnce();
    expect(document.documentElement.getAttribute('data-ai-agent')).toBe(
      'codex',
    );
    expect(document.body.getAttribute('data-ai-agent')).toBe('codex');
    expect(bodyStyle).toContain('--ai-primary');
    expect(bodyStyle).toContain('#10b981');
    expect(bodyStyle).toContain('--ai-background');
    expect(bodyStyle).toContain('#f0fdf4');
    expect(headerPropsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        branding: expect.objectContaining({
          siteName: 'Codex Central',
          tagline: 'コード生成AIの専門情報',
        }),
      }),
    );
  });

  it('サブドメインが解決できない場合でもデフォルトテーマとブランディングでフォールバックする', async () => {
    headersMock.mockReturnValue(mockHeaders(null));

    const RootLayout = (await import('../app/layout')).default;
    const markup = renderToStaticMarkup(
      await RootLayout({ children: <div>fallback</div> }),
    );
    const { document } = parseHTML(markup);
    const bodyStyle = extractBodyStyle(markup);

    expect(document.documentElement.getAttribute('data-ai-agent')).toBe(
      'default',
    );
    expect(document.body.getAttribute('data-ai-agent')).toBe('default');
    expect(bodyStyle).toContain('--ai-primary');
    expect(bodyStyle).toContain('#DB8163');
    expect(headerPropsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        branding: expect.objectContaining({
          siteName: 'CC-Vault',
          tagline: '技術記事のキュレーション',
        }),
      }),
    );
  });

  it('未知のサブドメインの場合はデフォルトエージェントにフォールバックする', async () => {
    headersMock.mockReturnValue(mockHeaders('unknown.example.com'));

    const RootLayout = (await import('../app/layout')).default;
    const markup = renderToStaticMarkup(
      await RootLayout({ children: <div>unknown</div> }),
    );
    const { document } = parseHTML(markup);

    expect(document.documentElement.getAttribute('data-ai-agent')).toBe(
      'default',
    );
  });
});
