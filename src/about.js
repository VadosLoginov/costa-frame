import './style.css'
import { config } from './config.js'
import { detectLocale, locales, localeLabels, setLocale, t } from './i18n.js'

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function instagramHref(value) {
  if (!value) return ''
  if (value.startsWith('http')) return value
  return `https://instagram.com/${value.replace(/^@/, '')}`
}

function langSwitcher(lang) {
  return locales
    .map(
      (code) => `
      <button
        type="button"
        class="lang__btn${code === lang ? ' is-active' : ''}"
        data-lang="${code}"
        aria-pressed="${code === lang}"
      >${localeLabels[code]}</button>`,
    )
    .join('')
}

function fillCollab(text, handle) {
  const safe = escapeHtml(handle)
  const href = escapeHtml(instagramHref(handle))
  return text.replace(
    '{collab}',
    `<a class="about-page__inline-link" href="${href}" target="_blank" rel="noopener noreferrer">${safe}</a>`,
  )
}

function channelTitleKey(key) {
  if (key === 'yoga') return 'projectYogaTitle'
  if (key === 'asmr') return 'projectAsmrTitle'
  return 'projectOpen'
}

function channelTextKey(key) {
  if (key === 'yoga') return 'aboutPageYogaText'
  if (key === 'asmr') return 'aboutPageAsmrText'
  return 'aboutPageYoutubeIntro'
}

function stockList() {
  return (config.stockLinks || [])
    .map(
      (item) => `
      <li>
        <a
          class="about-page__link"
          href="${escapeHtml(item.url)}"
          target="_blank"
          rel="noopener noreferrer"
        >${escapeHtml(item.label)}</a>
      </li>`,
    )
    .join('')
}

function channelBlocks(lang) {
  const collab = config.collaboratorInstagram || '@_lena_see'
  return (config.aboutChannels || [])
    .map((channel) => {
      const title = t(lang, channelTitleKey(channel.key))
      const body = fillCollab(t(lang, channelTextKey(channel.key)), collab)
      return `
        <article class="about-page__channel">
          <p>${body}</p>
          <a
            class="about-page__link"
            href="${escapeHtml(channel.url)}"
            target="_blank"
            rel="noopener noreferrer"
          >${escapeHtml(title)} →</a>
        </article>`
    })
    .join('')
}

function render(lang) {
  document.documentElement.lang = lang
  document.title = t(lang, 'aboutPageMetaTitle')

  let meta = document.querySelector('meta[name="description"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'description'
    document.head.appendChild(meta)
  }
  meta.content = t(lang, 'aboutPageMetaDescription')

  const ig = config.instagram
  const app = document.querySelector('#app')
  app.innerHTML = `
    <header class="site-header is-solid" data-site-header>
      <a class="logo" href="/">${t(lang, 'brand')}</a>
      <nav class="nav" aria-label="Primary">
        <a href="/#services">${t(lang, 'navServices')}</a>
        <a href="/#projects">${t(lang, 'navExamples')}</a>
        <a href="/#showreel">${t(lang, 'navShowreel')}</a>
        <a href="/#pricing">${t(lang, 'navPricing')}</a>
        <a href="${escapeHtml(config.aboutUrl || '/about.html')}" aria-current="page">${t(lang, 'navAbout')}</a>
        <a href="/#contact">${t(lang, 'navContact')}</a>
      </nav>
      <div class="header__actions">
        <div class="lang" role="group" aria-label="Language">${langSwitcher(lang)}</div>
        <a class="btn btn--header" href="/#contact">${t(lang, 'ctaContact')}</a>
      </div>
    </header>

    <main class="about-page" id="top">
      <div class="about-page__layout">
        <aside class="about-page__aside reveal">
          <figure class="about-page__photo">
            <img
              src="${config.photo}"
              alt="${escapeHtml(config.name)}"
              width="640"
              height="800"
              loading="eager"
            />
          </figure>
          <h1 class="about-page__name">${escapeHtml(config.name)}</h1>
          <p class="about-page__role">${t(lang, 'brand')} · Costa Blanca</p>
          ${
            ig
              ? `<a
                  class="about-page__ig"
                  href="${escapeHtml(instagramHref(ig))}"
                  target="_blank"
                  rel="noopener noreferrer"
                >${t(lang, 'aboutPageInstagram')}: ${escapeHtml(ig)}</a>`
              : ''
          }
        </aside>

        <article class="about-page__body">
          <p class="about-page__kicker reveal">${t(lang, 'aboutPageTitle')}</p>
          <p class="about-page__lead reveal">${t(lang, 'aboutPageGreeting')}</p>
          <div class="about-page__prose reveal">
            <p>${t(lang, 'aboutPageP1')}</p>
            <p>${t(lang, 'aboutPageP2')}</p>
            <p>${t(lang, 'aboutPageP3')}</p>
          </div>

          <section class="about-page__block reveal">
            <h2>${t(lang, 'aboutPageStocksTitle')}</h2>
            <ul class="about-page__links">${stockList()}</ul>
          </section>

          <section class="about-page__block reveal">
            <p>${t(lang, 'aboutPageYoutubeIntro')}</p>
            <div class="about-page__channels">${channelBlocks(lang)}</div>
          </section>

          <div class="about-page__prose reveal">
            <p>${t(lang, 'aboutPageP4')}</p>
            <p>${t(lang, 'aboutPageP5')}</p>
            <p>${t(lang, 'aboutPageP6')}</p>
          </div>

          <div class="about-page__cta reveal">
            <a class="btn btn--primary" href="/#contact">${t(lang, 'ctaContact')}</a>
            <a class="btn btn--ghost" href="/">${t(lang, 'aboutPageBack')}</a>
          </div>
        </article>
      </div>
    </main>

    <footer class="site-footer">
      <span>${t(lang, 'brand')}</span>
      <span>${t(lang, 'footerCredit')}</span>
    </footer>
  `

  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.getAttribute('data-lang')
      setLocale(next)
      render(next)
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
    })
  })

  observeReveals()
}

function observeReveals() {
  const nodes = document.querySelectorAll('.reveal')
  if (!('IntersectionObserver' in window)) {
    nodes.forEach((el) => el.classList.add('is-visible'))
    return
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 },
  )
  nodes.forEach((el) => io.observe(el))
}

render(detectLocale())
