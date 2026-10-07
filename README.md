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

## Project type examples

In [`src/config.js`](src/config.js) → `projectTypes`, paste a YouTube link into `videoUrl` for each type:

```js
{ labelKey: 'useBeauty', videoUrl: 'https://youtu.be/XXXX', image: '' },
```

Optional custom thumbnail: `image: '/examples/beauty.jpg'`.

## Hero background & screenshots

Drop your images into [`public/hero/`](public/hero/), then list them in [`src/config.js`](src/config.js):

```js
heroImages: [
  '/hero/01.jpg',
  '/hero/02.jpg',
  { src: '/hero/03.jpg', thumb: '/hero/03-thumb.jpg' }, // optional smaller thumb
],
```

While `heroImages` is empty, the hero uses YouTube previews as a fallback.

## YouTube carousel auto-update

List of videos: [`src/youtube-projects.json`](src/youtube-projects.json).

Refresh manually:

```bash
npm run update:youtube
```

Weekly auto-update: GitHub Action [`.github/workflows/update-youtube.yml`](.github/workflows/update-youtube.yml) runs every Monday and commits changes. If the repo is connected to Cloudflare Pages, the site redeploys after the push.

You can also run it by hand: GitHub → **Actions** → **Update YouTube carousels** → **Run workflow**.

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
