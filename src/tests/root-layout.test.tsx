import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseHTML } from 'linkedom';

const headersMock = vi.fn();

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
  default: () => <header data-testid='header' />,
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

describe('RootLayout', () => {
  beforeEach(() => {
    headersMock.mockReset();
  });

  it('ホスト名から識別されたAIエージェントをdata属性として適用する', async () => {
    headersMock.mockReturnValue(mockHeaders('claude-code.example.com'));

    const RootLayout = (await import('../app/layout')).default;
    const markup = renderToStaticMarkup(
      await RootLayout({ children: <div>content</div> }),
    );
    const { document } = parseHTML(markup);

    expect(headersMock).toHaveBeenCalledOnce();
    expect(document.documentElement.getAttribute('data-ai-agent')).toBe(
      'claude-code',
    );
    expect(document.documentElement.getAttribute('lang')).toBe('ja');
    expect(document.body.className).toContain('mocked-inter');
  });

  it('サブドメインが解決できない場合でもデフォルトエージェントでフォールバックする', async () => {
    headersMock.mockReturnValue(mockHeaders(null));

    const RootLayout = (await import('../app/layout')).default;
    const markup = renderToStaticMarkup(
      await RootLayout({ children: <div>fallback</div> }),
    );
    const { document } = parseHTML(markup);

    expect(document.documentElement.getAttribute('data-ai-agent')).toBe(
      'default',
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
