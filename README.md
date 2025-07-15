```md
sui@MyDesktopPC:~/dev/cc-vault$ pnpm run preview

> cc-valut@0.0.1 preview /home/sui/dev/cc-vault
> opennextjs-cloudflare build && opennextjs-cloudflare preview


┌─────────────────────────────┐
│ OpenNext — Cloudflare build │
└─────────────────────────────┘

App directory: /home/sui/dev/cc-vault
Next.js version : 15.3.0
@opennextjs/cloudflare version: 1.5.1
@opennextjs/aws version: 3.7.0

┌─────────────────────────────────┐
│ OpenNext — Building Next.js app │
└─────────────────────────────────┘


> cc-valut@0.0.1 build /home/sui/dev/cc-vault
> next build

Using vars defined in .dev.vars
Using vars defined in .dev.vars
   ▲ Next.js 15.3.0
   - Environments: .env.local

   Creating an optimized production build ...
Using vars defined in .dev.vars
Using vars defined in .dev.vars
Using vars defined in .dev.vars
 ✓ Compiled successfully in 4.0s
 ✓ Linting and checking validity of types    
 ✓ Collecting page data    
 ✓ Generating static pages (11/11)
 ✓ Collecting build traces    
 ✓ Finalizing page optimization    

Route (app)                                 Size  First Load JS  Revalidate  Expire
┌ ○ /                                    17.3 kB         119 kB          1h      1y
├ ○ /_not-found                            152 B         102 kB
├ ○ /features                              173 B         105 kB
├ ○ /help                                  152 B         102 kB
├ ○ /privacy                               152 B         102 kB
├ ○ /robots.txt                            152 B         102 kB
├ ○ /sitemap.xml                           152 B         102 kB
└ ○ /terms                                 152 B         102 kB
+ First Load JS shared by all             101 kB
  ├ chunks/211-572a04bdc16dea49.js       46.3 kB
  ├ chunks/6ac09d6e-5ff62d6106155356.js  53.2 kB
  └ other shared chunks (total)          1.89 kB


○  (Static)  prerendered as static content


┌──────────────────────────────┐
│ OpenNext — Generating bundle │
└──────────────────────────────┘

Bundling middleware function...
Bundling static assets...
Bundling cache assets...
Building server function: default...
Applying code patches: 2.762s
# copyPackageTemplateFiles
⚙️ Bundling the OpenNext server...

Worker saved in `.open-next/worker.js` 🚀

OpenNext build complete.

┌───────────────────────────────┐
│ OpenNext — Cloudflare preview │
└───────────────────────────────┘

Incremental cache does not need populating
Tag cache does not need populating

 ⛅️ wrangler 4.24.3
───────────────────
Using vars defined in .dev.vars
Your Worker has access to the following bindings:
Binding                                     Resource                  Mode
env.WORKER_SELF_REFERENCE (cc-valut)        Worker                    local [not connected]
env.ASSETS                                  Assets                    local
env.NEXTJS_ENV ("(hidden)")                 Environment Variable      local
env.QIITA_ACCESS_TOKEN ("(hidden)")         Environment Variable      local
env.API_URL ("(hidden)")                    Environment Variable      local


Service bindings, Durable Object bindings, and Tail consumers connect to other `wrangler dev` processes running locally, with their connection status indicated by [connected] or [not connected]. For more details, refer to https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/#local-development

╭──────────────────────────────────────────────────────────────────────╮
│  [b] open a browser [d] open devtools [c] clear console [x] to exit  │
╰──────────────────────────────────────────────────────────────────────╯
[wrangler:info] Ready on http://localhost:3000
⎔ Starting local server...
[wrangler:info] ✨ Parsed 1 valid header rule.
✘ [ERROR] HTML fetch error: EvalError: Code generation from strings disallowed for this context

      at Function (<anonymous>)
      at compile (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:136843:458)
      at collect (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:137142:405)
      at select (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:137136:275)
      at Object.first (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:137121:73)
      at DocumentImpl.querySelector
  (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:138523:50)
      at DocumentImpl.baseURL (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:153923:32)
      at HTMLStyleElementImpl._updateAStyleBlock
  (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:157525:63)
      at HTMLStyleElementImpl._attach
  (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:157506:66)
      at HTMLHeadElementImpl._insert
  (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:137628:111)


✘ [ERROR] ⨯ EvalError: Code generation from strings disallowed for this context

      at Function (<anonymous>)
      at compile (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:136843:458)
      at collect (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:137142:405)
      at select (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:137136:275)
      at Object.first (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:137121:73)
      at DocumentImpl.querySelector
  (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:138523:50)
      at DocumentImpl.baseURL (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:153923:32)
      at HTMLStyleElementImpl._updateAStyleBlock
  (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:157525:63)
      at HTMLStyleElementImpl._attach
  (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:157506:66)
      at HTMLHeadElementImpl._insert
  (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:137628:111) {
    digest: '947807751'
  }
   ⨯ EvalError: Code generation from strings disallowed for this context
      at Function (<anonymous>)
      at compile (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:136843:458)
      at collect (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:137142:405)
      at select (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:137136:275)
      at Object.first (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:137121:73)
      at DocumentImpl.querySelector
  (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:138523:50)
      at DocumentImpl.baseURL (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:153923:32)
      at HTMLStyleElementImpl._updateAStyleBlock
  (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:157525:63)
      at HTMLStyleElementImpl._attach
  (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:157506:66)
      at HTMLHeadElementImpl._insert
  (home/sui/dev/cc-vault/.wrangler/tmp/dev-frm8iN/worker.js:137628:111) {
    digest: '947807751'
  }


[wrangler:info] GET / 500 Internal Server Error (791ms)
[wrangler:info] GET /_next/static/chunks/webpack-8fccbe609b9d0e52.js 200 OK (4ms)
[wrangler:info] GET /_next/static/chunks/framework-8842f7163ce89362.js 200 OK (6ms)
[wrangler:info] GET /_next/static/chunks/main-b78e0c5e79cacafb.js 200 OK (8ms)
[wrangler:info] GET /_next/static/chunks/pages/_app-a452cd53d10e2899.js 200 OK (7ms)
[wrangler:info] GET /_next/static/fjjRCJgkNpsAEFqkACDNk/_ssgManifest.js 200 OK (3ms)
[wrangler:info] GET /_next/static/fjjRCJgkNpsAEFqkACDNk/_buildManifest.js 200 OK (6ms)
[wrangler:info] GET /_next/static/chunks/pages/_error-ef44328ee270e7ed.js 200 OK (12ms)
⎔ Shutting down local server...
🪵  Logs were written to "/home/sui/.config/.wrangler/logs/wrangler-2025-07-15_12-27-20_099.log"
```

```