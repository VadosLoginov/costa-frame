# Costa Frame

Landing site for Vadim Loginov — camera & drone video in Costa Blanca.

## Local

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Edit contacts / showreel

Open [`src/config.js`](src/config.js):

- `phone`, `email` — already set
- `telegram`, `instagram` — paste `@username` or full URL; buttons appear when filled
- `showreelUrl` — YouTube/Vimeo watch or embed URL

## Deploy on Cloudflare Pages (free)

1. Create a GitHub repository and push this project.
2. In [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select the repo. Build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy. You get a URL like `https://costa-frame.pages.dev`.
5. Optional: attach a custom domain in Pages → **Custom domains**.

### Push helper

```bash
git add .
git commit -m "Initial Costa Frame site"
gh repo create costa-frame --public --source=. --remote=origin --push
```

Then connect that repo in Cloudflare Pages as above.
