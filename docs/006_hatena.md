# 取得URLの例

- 新着順 : https://b.hatena.ne.jp/q/%22claude%20code%22?target=tag&date_range=m&safe=on&users=3&sort=recent
- 人気順 : https://b.hatena.ne.jp/q/%22claude%20code%22?users=3&target=tag&sort=popular&date_range=m&safe=on

# 対象の検索ワード

src/lib/constants.ts参照

# 注意点

- はてなにはいいね順とブックマークがないので、仮置きの値を設定する
- 著者欄には以下の遷移先の概要を乗せる(下の例でいうと`zenn.dev/mizchi`)

# 取得要素

- タイトル
- 遷移先URL
- 遷移先の概要`<a href="/site/zenn.dev/mizchi" title="『zenn.dev/mizchi』の新着エントリー" data-gtm-click-label="entry-search-result-item-site-search-url">zenn.dev/mizchi </a>`

# HTMLの例

`<li class="bookmark-item js-user-bookmark-item js-keyboard-selectable-item">`の要素が複数あるので、Cloudflare 環境 (Workers 等) で document.querySelectorAll() 相当の処理を行うようにすること
```html
<li class="bookmark-item js-user-bookmark-item js-keyboard-selectable-item">
  <div class="centerarticle-entry is-image-entry-unit">
    <div class="js-bookmark-stock-button" data-initialized="">
      <button class="js-bookmark-stock-button-ready readlater-button" data-gtm-click-label="entry-search-result-item-stock-button" title="あとで読む" aria-label="あとで読む" tabindex="0" type="button" data-href="https://zenn.dev/mizchi/articles/claude-code-cheatsheet">
        <span>あとで読む</span>
      </button>
    </div>
    <div class="centerarticle-entry-header">
      <h3 class="centerarticle-entry-title">
        <a href="https://zenn.dev/mizchi/articles/claude-code-cheatsheet" class="js-clickable-link js-keyboard-openable" target="_blank" rel="noopener" data-gtm-click-label="entry-search-result-item-title">
          <img class="centerarticle-entry-favicon" src="https://cdn-ak2.favicon.st-hatena.com/64?url=https%3A%2F%2Fzenn.dev%2Fmizchi%2Farticles%2Fclaude-code-cheatsheet" alt="">速習 Claude Code 
        </a>
      </h3>
      <ul class="centerarticle-entry-data">
        <li>
          <span class="centerarticle-users">
            <a href="/entry/s/zenn.dev/mizchi/articles/claude-code-cheatsheet" class="js-keyboard-entry-page-openable" title="速習 Claude Code (928 ブックマーク)" data-gtm-click-label="entry-search-result-item-users">928 users </a>
          </span>
        </li>
        <li>
          <a href="/site/zenn.dev/mizchi" title="『zenn.dev/mizchi』の新着エントリー" data-gtm-click-label="entry-search-result-item-site-search-url">zenn.dev/mizchi </a>
        </li>
        <li>
          <a href="/hotentry/it" data-gtm-click-label="entry-search-result-item-category">テクノロジー</a>
        </li>
        <li>
          <span class="entry-contents-date">2025/07/07</span>
        </li>
      </ul>
    </div>
    <div class="centerarticle-entry-contents has-image">
      <div class="centerarticle-entry-item">
        <p class="centerarticle-entry-summary">講習会用にまとめたもの。可能なら公式ドキュメントを参照するのを推奨するが、この資料ではサッと使いはじめるために要点を絞って解説する。 claude-code は claude-code 自身で開発されており、恐ろしい速度で更新されてる点に注意。この資料は一瞬で古くなる。 アカウントの契約等は省略 インストールと実行</p>
        <ul class="entrysearch-entry-tags">
          <li>
            <a href="/q/AI" data-gtm-click-label="entry-search-result-item-tag">AI</a>
          </li>
          <li>
            <a href="/q/%E3%81%82%E3%81%A8%E3%81%A7%E8%AA%AD%E3%82%80" data-gtm-click-label="entry-search-result-item-tag">あとで読む</a>
          </li>
          <li>
            <a href="/q/Claude" data-gtm-click-label="entry-search-result-item-tag">Claude</a>
          </li>
          <li>
            <a href="/q/claudecode" data-gtm-click-label="entry-search-result-item-tag">claudecode</a>
          </li>
          <li>
            <a href="/q/%E9%96%8B%E7%99%BA" data-gtm-click-label="entry-search-result-item-tag">開発</a>
          </li>
          <li>
            <a href="/q/%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0" data-gtm-click-label="entry-search-result-item-tag">プログラミング</a>
          </li>
          <li>
            <a href="/q/programming" data-gtm-click-label="entry-search-result-item-tag">programming</a>
          </li>
          <li>
            <a href="/q/%22Claude%20Code%22" data-gtm-click-label="entry-search-result-item-tag">Claude Code</a>
          </li>
          <li>
            <a href="/q/%E8%B3%87%E6%96%99" data-gtm-click-label="entry-search-result-item-tag">資料</a>
          </li>
          <li>
            <a href="/q/code" data-gtm-click-label="entry-search-result-item-tag">code</a>
          </li>
        </ul>
        <div class="following-bookmarks-container js-following-bookmarks-container" data-entry-url="https://zenn.dev/mizchi/articles/claude-code-cheatsheet">
          <ul class="following-bookmarks js-following-bookmarks"></ul>
          <script type="text/x-template" id="template-following-bookmark">
<li>
  <a href="{{ anchor_path }}" class="following-bookmark-link" data-gtm-label="entry-info-followingBookmarks">
    <img src="{{ profile_image_url }}" alt="{{ user_name }}" class="following-bookmark-icon">
  </a>
  <span class="following-bookmark-popup">
    <span class="following-bookmark-username">{{ user_name }}</span><span class="following-bookmark-timestamp">{{ created }}</span>
    <span class="following-bookmark-text">
      {{ #comment }}<span class="following-bookmark-comment">{{ comment }}</span>{{ /comment }}
      <ul class="following-bookmark-tags">{{ #tags }}<li>{{ label }}</li>{{ /tags }}</ul>
    </span>
  </span>
</li>
</script>
        </div>
      </div>
      <div class="centerarticle-entry-image-wrapper">
        <a href="https://zenn.dev/mizchi/articles/claude-code-cheatsheet" class="centerarticle-entry-image" target="_blank" rel="noopener">
          <img src="https://cdn-ak-scissors.b.st-hatena.com/image/square/a67175fc2a374baeee9e86dbc83f3e517dfbb95f/height=288;version=1;width=512/https%3A%2F%2Fres.cloudinary.com%2Fzenn%2Fimage%2Fupload%2Fs--6G1zjVdT--%2Fc_fit%252Cg_north_west%252Cl_text%3Anotosansjp-medium.otf_72%3A%2525E9%252580%25259F%2525E7%2525BF%252592%252520Claude%252520Code%252Cw_1010%252Cx_90%252Cy_100%2Fg_south_west%252Cl_text%3Anotosansjp-medium.otf_37%3Amizchi%252Cx_203%252Cy_121%2Fg_south_west%252Ch_90%252Cl_fetch%3AaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2liclRHT052Z3d3ay1fNGxlcVk4TGNGSlNuX0FoWnpEWVlKaXJNcWc9czI1MC1j%252Cr_max%252Cw_90%252Cx_87%252Cy_95%2Fv1627283836%2Fdefault%2Fog-base-w1200-v2.png" alt="速習 Claude Code" data-gtm-click-label="entry-search-result-item-image">
        </a>
      </div>
    </div>
  </div>
</li>
```
# 

# 制約事項

- BrowserライクのAPIは使用不可
- cheerioを使用する
