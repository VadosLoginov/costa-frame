#!/usr/bin/env node
/**
 * Fetches latest videos from YouTube channels and updates
 * src/youtube-projects.json for the carousel.
 *
 * Tries channel RSS first, then falls back to the /videos page
 * (RSS is often unavailable from CI / some networks).
 *
 * Usage: npm run update:youtube
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const projectsPath = join(root, 'src', 'youtube-projects.json')

const UA =
  'Mozilla/5.0 (compatible; CostaFrameUpdater/1.1; +https://github.com/VadosLoginov/costa-frame)'

function decodeXml(text) {
  return text
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&apos;', "'")
}

function decodeHtml(text) {
  return text
    .replaceAll('\\u0026', '&')
    .replaceAll('\\"', '"')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .trim()
}

async function fetchChannelVideosFromRss(channelId, maxVideos) {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
  const res = await fetch(feedUrl, {
    headers: {
      'User-Agent': UA,
      Accept: 'application/atom+xml, application/xml, text/xml, */*',
    },
  })

  if (!res.ok) {
    throw new Error(`RSS ${res.status}`)
  }

  const xml = await res.text()
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
  const videos = []

  for (const match of entries) {
    const entry = match[1]
    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]
    const titleRaw =
      entry.match(/<media:title>([^<]*)<\/media:title>/)?.[1] ??
      entry.match(/<title>([^<]*)<\/title>/)?.[1]
    if (!id || !titleRaw) continue
    videos.push({ id, title: decodeXml(titleRaw).trim() })
    if (videos.length >= maxVideos) break
  }

  return videos
}

function extractVideosFromHtml(html, maxVideos) {
  const videos = []
  const seen = new Set()
  const skipTitles = new Set([
    'add to queue',
    'add to playlist',
    'share',
    'añadir a la cola',
    'añadir a lista de reproducción',
    'compartir',
  ])

  // Current YouTube channel UI uses richItemRenderer / lockupViewModel
  const blocks = [
    ...html.split('"richItemRenderer"').slice(1),
    ...html.split('"videoRenderer"').slice(1),
    ...html.split('"gridVideoRenderer"').slice(1),
  ]

  for (const block of blocks) {
    const chunk = block.slice(0, 8000)
    const id =
      chunk.match(/"watchEndpoint":\{"videoId":"([a-zA-Z0-9_-]{6,})"/)?.[1] ??
      chunk.match(/\/watch\?v=([a-zA-Z0-9_-]{11})/)?.[1] ??
      chunk.match(/"videoId":"([a-zA-Z0-9_-]{6,})"/)?.[1]

    if (!id || seen.has(id)) continue

    const titleRaw =
      chunk.match(/"title":\{"content":"((?:\\.|[^"\\])*)"/)?.[1] ??
      chunk.match(/"title":\{"runs":\[\{"text":"((?:\\.|[^"\\])*)"\}/)?.[1] ??
      chunk.match(/"title":\{"simpleText":"((?:\\.|[^"\\])*)"/)?.[1]

    if (!titleRaw) continue

    let title = decodeHtml(titleRaw)
    title = title.replace(/\s+by\s+.+$/i, '').trim()
    if (!title || skipTitles.has(title.toLowerCase())) continue

    seen.add(id)
    videos.push({ id, title })
    if (videos.length >= maxVideos) break
  }

  return videos
}

async function fetchChannelVideosFromPage(channelUrl, maxVideos) {
  const base = (channelUrl || '').replace(/\/$/, '')
  if (!base) throw new Error('missing channel url')

  const pageUrl = `${base}/videos?hl=en&gl=US`
  const res = await fetch(pageUrl, {
    headers: {
      'User-Agent': UA,
      'Accept-Language': 'en-US,en;q=0.9',
      Accept: 'text/html,application/xhtml+xml',
    },
    redirect: 'follow',
  })

  if (!res.ok) {
    throw new Error(`Page ${res.status} for ${pageUrl}`)
  }

  const html = await res.text()
  const videos = extractVideosFromHtml(html, maxVideos)
  if (!videos.length) {
    throw new Error(`No videos parsed from ${pageUrl}`)
  }
  return videos
}

async function fetchChannelVideos(project, maxVideos) {
  if (project.channelId) {
    try {
      const fromRss = await fetchChannelVideosFromRss(project.channelId, maxVideos)
      if (fromRss.length) return fromRss
    } catch (err) {
      console.warn(`  RSS unavailable (${err.message}), trying channel page…`)
    }
  }

  return fetchChannelVideosFromPage(project.url, maxVideos)
}

function sameVideos(a, b) {
  if (a.length !== b.length) return false
  return a.every((video, i) => video.id === b[i].id && video.title === b[i].title)
}

async function main() {
  const projects = JSON.parse(readFileSync(projectsPath, 'utf8'))
  let changed = false
  let failures = 0

  for (const project of projects) {
    if (!project.channelId && !project.url) {
      console.warn(`Skip ${project.handle || project.key}: missing channelId/url`)
      continue
    }

    const maxVideos = project.maxVideos ?? 6
    console.log(`Updating ${project.handle || project.key}…`)

    let videos
    try {
      videos = await fetchChannelVideos(project, maxVideos)
    } catch (err) {
      failures += 1
      console.error(`  Failed: ${err.message}`)
      continue
    }

    if (!videos.length) {
      failures += 1
      console.warn(`  No videos found`)
      continue
    }

    if (sameVideos(project.videos || [], videos)) {
      console.log(`  Unchanged (${videos.length} videos)`)
      continue
    }

    project.videos = videos
    changed = true
    console.log(`  Updated ${videos.length} videos:`)
    for (const video of videos) {
      console.log(`    - ${video.id}  ${video.title}`)
    }
  }

  if (changed) {
    writeFileSync(projectsPath, `${JSON.stringify(projects, null, 2)}\n`, 'utf8')
    console.log(`Wrote ${projectsPath}`)
  } else {
    console.log('No changes.')
  }

  if (failures === projects.length) {
    throw new Error('All channel updates failed')
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
