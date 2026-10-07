#!/usr/bin/env node
/**
 * Fetches latest videos from YouTube channel RSS feeds
 * and updates src/youtube-projects.json for the carousel.
 *
 * Usage: npm run update:youtube
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const projectsPath = join(root, 'src', 'youtube-projects.json')

function decodeXml(text) {
  return text
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&apos;', "'")
}

async function fetchChannelVideos(channelId, maxVideos) {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
  const res = await fetch(feedUrl, {
    headers: {
      'User-Agent': 'CostaFrameUpdater/1.0 (+https://github.com/VadosLoginov/costa-frame)',
      Accept: 'application/atom+xml, application/xml, text/xml',
    },
  })

  if (!res.ok) {
    throw new Error(`RSS ${res.status} for ${channelId}`)
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

function sameVideos(a, b) {
  if (a.length !== b.length) return false
  return a.every((video, i) => video.id === b[i].id && video.title === b[i].title)
}

async function main() {
  const projects = JSON.parse(readFileSync(projectsPath, 'utf8'))
  let changed = false

  for (const project of projects) {
    if (!project.channelId) {
      console.warn(`Skip ${project.handle}: missing channelId`)
      continue
    }

    const maxVideos = project.maxVideos ?? 6
    console.log(`Updating ${project.handle}…`)
    const videos = await fetchChannelVideos(project.channelId, maxVideos)

    if (!videos.length) {
      console.warn(`  No videos found for ${project.handle}`)
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

  if (!changed) {
    console.log('No changes.')
    process.exitCode = 0
    return
  }

  writeFileSync(projectsPath, `${JSON.stringify(projects, null, 2)}\n`, 'utf8')
  console.log(`Wrote ${projectsPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
