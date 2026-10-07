import './style.css'
import { config } from './config.js'
import { detectLocale, locales, localeLabels, setLocale, t } from './i18n.js'

const phoneDigits = config.phone.replace(/\D/g, '')

function telegramHref(value) {
  if (!value) return ''
  if (value.startsWith('http')) return value
  const user = value.replace(/^@/, '')
  return `https://t.me/${user}`
}

function instagramHref(value) {
  if (!value) return ''
  if (value.startsWith('http')) return value
  const user = value.replace(/^@/, '')
  return `https://instagram.com/${user}`
}

function embedUrl(url) {
  if (!url) return ''
  if (url.includes('/embed/') || url.includes('player.vimeo.com')) return url
  const yt = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]+)/,
  )
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return url
}

function contactButtons(lang) {
  const items = [
    {
      href: `tel:${config.phone}`,
      label: t(lang, 'contactPhone'),
      className: 'btn btn--ghost',
      show: Boolean(config.phone),
    },
    {
      href: `https://wa.me/${phoneDigits}`,
      label: t(lang, 'contactWhatsApp'),
      className: 'btn btn--primary',
      show: Boolean(config.phone),
      external: true,
    },
    {
      href: `mailto:${config.email}`,
      label: t(lang, 'contactEmail'),
      className: 'btn btn--ghost',
      show: Boolean(config.email),
    },
    {
      href: telegramHref(config.telegram),
      label: t(lang, 'contactTelegram'),
      className: 'btn btn--ghost',
      show: Boolean(config.telegram?.trim()),
      external: true,
    },
    {
      href: instagramHref(config.instagram),
      label: t(lang, 'contactInstagram'),
      className: 'btn btn--ghost',
      show: Boolean(config.instagram?.trim()),
      external: true,
    },
  ]

  return items
    .filter((item) => item.show)
    .map(
      (item) => `
      <a class="${item.className}" href="${item.href}"${
        item.external ? ' target="_blank" rel="noopener noreferrer"' : ''
      }>${item.label}</a>`,
    )
    .join('')
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

function showreelBlock(lang) {
  const src = embedUrl(config.showreelUrl?.trim())
  if (src) {
    return `
      <div class="showreel__frame reveal">
        <iframe
          src="${src}"
          title="${t(lang, 'showreelTitle')}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>`
  }
  return `
    <div class="showreel__placeholder reveal" data-i18n="showreelPlaceholder">
      ${t(lang, 'showreelPlaceholder')}
    </div>`
}

function projectTitleKey(key) {
  return key === 'yoga' ? 'projectYogaTitle' : 'projectAsmrTitle'
}

function projectDescKey(key) {
  return key === 'yoga' ? 'projectYogaDesc' : 'projectAsmrDesc'
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function projectsBlock(lang) {
  const projects = config.youtubeProjects || []
  if (!projects.length) return ''

  return projects
    .map((project) => {
      const slides = (project.videos || [])
        .map(
          (video) => `
          <a
            class="carousel__slide"
            href="https://www.youtube.com/watch?v=${video.id}"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://i.ytimg.com/vi/${video.id}/mqdefault.jpg"
              alt="${escapeHtml(video.title)}"
              width="320"
              height="180"
              loading="lazy"
            />
            <span class="carousel__caption">${escapeHtml(video.title)}</span>
          </a>`,
        )
        .join('')

      return `
        <article class="yt-project reveal">
          <div class="yt-project__head">
            <div>
              <h3>${t(lang, projectTitleKey(project.key))}</h3>
              <p class="yt-project__handle">${escapeHtml(project.handle)}</p>
              <p>${t(lang, projectDescKey(project.key))}</p>
            </div>
            <a
              class="btn btn--ghost"
              href="${project.url}"
              target="_blank"
              rel="noopener noreferrer"
            >${t(lang, 'projectOpen')}</a>
          </div>
          <div class="carousel" data-carousel>
            <button
              type="button"
              class="carousel__nav carousel__nav--prev"
              data-carousel-prev
              aria-label="${t(lang, 'projectPrev')}"
            >‹</button>
            <div class="carousel__track" data-carousel-track tabindex="0">
              ${slides}
            </div>
            <button
              type="button"
              class="carousel__nav carousel__nav--next"
              data-carousel-next
              aria-label="${t(lang, 'projectNext')}"
            >›</button>
          </div>
        </article>`
    })
    .join('')
}

function render(lang) {
  document.documentElement.lang = lang
  document.title = t(lang, 'metaTitle')

  let meta = document.querySelector('meta[name="description"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'description'
    document.head.appendChild(meta)
  }
  meta.content = t(lang, 'metaDescription')

  const app = document.querySelector('#app')
  app.innerHTML = `
    <div class="ambient" aria-hidden="true"></div>

    <header class="site-header">
      <a class="logo" href="#top" data-i18n="brand">${t(lang, 'brand')}</a>
      <nav class="nav" aria-label="Primary">
        <a href="#services" data-i18n="navServices">${t(lang, 'navServices')}</a>
        <a href="#pricing" data-i18n="navPricing">${t(lang, 'navPricing')}</a>
        <a href="#gear" data-i18n="navGear">${t(lang, 'navGear')}</a>
        <a href="#showreel" data-i18n="navShowreel">${t(lang, 'navShowreel')}</a>
        <a href="#projects" data-i18n="navProjects">${t(lang, 'navProjects')}</a>
        <a href="#contact" data-i18n="navContact">${t(lang, 'navContact')}</a>
      </nav>
      <div class="lang" role="group" aria-label="Language">${langSwitcher(lang)}</div>
    </header>

    <main id="top">
      <section class="hero">
        <p class="hero__brand reveal" data-i18n="brand">${t(lang, 'brand')}</p>
        <h1 class="hero__title reveal" data-i18n="heroTitle">${t(lang, 'heroTitle')}</h1>
        <p class="hero__lead reveal" data-i18n="heroLead">${t(lang, 'heroLead')}</p>
        <div class="hero__cta reveal">
          <a class="btn btn--primary" href="#contact" data-i18n="ctaContact">${t(lang, 'ctaContact')}</a>
          <a class="btn btn--ghost" href="https://wa.me/${phoneDigits}" target="_blank" rel="noopener noreferrer" data-i18n="ctaWhatsApp">${t(lang, 'ctaWhatsApp')}</a>
        </div>
      </section>

      <section class="section" id="services">
        <div class="section__head">
          <h2 class="reveal" data-i18n="servicesTitle">${t(lang, 'servicesTitle')}</h2>
          <p class="section__lead reveal" data-i18n="servicesLead">${t(lang, 'servicesLead')}</p>
        </div>
        <div class="services">
          <article class="service reveal">
            <h3 data-i18n="cameraTitle">${t(lang, 'cameraTitle')}</h3>
            <p data-i18n="cameraText">${t(lang, 'cameraText')}</p>
          </article>
          <article class="service reveal">
            <h3 data-i18n="droneTitle">${t(lang, 'droneTitle')}</h3>
            <p data-i18n="droneText">${t(lang, 'droneText')}</p>
            <p class="license" data-i18n="licenseNote">${t(lang, 'licenseNote')}</p>
          </article>
        </div>
      </section>

      <section class="section section--soft" id="for-whom">
        <div class="section__head">
          <h2 class="reveal" data-i18n="forWhomTitle">${t(lang, 'forWhomTitle')}</h2>
          <p class="section__lead reveal" data-i18n="forWhomLead">${t(lang, 'forWhomLead')}</p>
        </div>
        <ul class="uses reveal">
          <li data-i18n="usePodcasts">${t(lang, 'usePodcasts')}</li>
          <li data-i18n="useYoutube">${t(lang, 'useYoutube')}</li>
          <li data-i18n="useTrainings">${t(lang, 'useTrainings')}</li>
          <li data-i18n="useEvents">${t(lang, 'useEvents')}</li>
          <li data-i18n="useBeauty">${t(lang, 'useBeauty')}</li>
          <li data-i18n="useFamily">${t(lang, 'useFamily')}</li>
          <li data-i18n="useSocial">${t(lang, 'useSocial')}</li>
          <li data-i18n="useReels">${t(lang, 'useReels')}</li>
        </ul>
      </section>

      <section class="section" id="pricing">
        <div class="section__head">
          <h2 class="reveal" data-i18n="pricingTitle">${t(lang, 'pricingTitle')}</h2>
          <p class="section__lead reveal" data-i18n="pricingLead">${t(lang, 'pricingLead')}</p>
        </div>
        <div class="prices">
          <div class="price reveal">
            <div class="price__row">
              <h3 data-i18n="priceCameraEdit">${t(lang, 'priceCameraEdit')}</h3>
              <p class="price__value" data-i18n="priceCameraEditValue">${t(lang, 'priceCameraEditValue')}</p>
            </div>
            <p class="price__meta" data-i18n="priceCameraEditMeta">${t(lang, 'priceCameraEditMeta')}</p>
          </div>
          <div class="price reveal">
            <div class="price__row">
              <h3 data-i18n="priceCameraRaw">${t(lang, 'priceCameraRaw')}</h3>
              <p class="price__value" data-i18n="priceCameraRawValue">${t(lang, 'priceCameraRawValue')}</p>
            </div>
            <p class="price__meta" data-i18n="priceCameraRawMeta">${t(lang, 'priceCameraRawMeta')}</p>
          </div>
          <div class="price reveal">
            <div class="price__row">
              <h3 data-i18n="priceDroneEdit">${t(lang, 'priceDroneEdit')}</h3>
              <p class="price__value" data-i18n="priceDroneEditValue">${t(lang, 'priceDroneEditValue')}</p>
            </div>
            <p class="price__meta" data-i18n="priceDroneEditMeta">${t(lang, 'priceDroneEditMeta')}</p>
          </div>
          <div class="price reveal">
            <div class="price__row">
              <h3 data-i18n="priceDroneRaw">${t(lang, 'priceDroneRaw')}</h3>
              <p class="price__value" data-i18n="priceDroneRawValue">${t(lang, 'priceDroneRawValue')}</p>
            </div>
            <p class="price__meta" data-i18n="priceDroneRawMeta">${t(lang, 'priceDroneRawMeta')}</p>
          </div>
        </div>
        <p class="pricing-note reveal" data-i18n="pricingNote">${t(lang, 'pricingNote')}</p>
      </section>

      <section class="section section--soft" id="gear">
        <div class="section__head">
          <h2 class="reveal" data-i18n="gearTitle">${t(lang, 'gearTitle')}</h2>
          <p class="section__lead reveal" data-i18n="gearLead">${t(lang, 'gearLead')}</p>
        </div>
        <ul class="gear reveal">
          <li data-i18n="gearCamera1">${t(lang, 'gearCamera1')}</li>
          <li data-i18n="gearCamera2">${t(lang, 'gearCamera2')}</li>
          <li data-i18n="gearLenses">${t(lang, 'gearLenses')}</li>
          <li data-i18n="gearGimbal">${t(lang, 'gearGimbal')}</li>
          <li data-i18n="gearDrone">${t(lang, 'gearDrone')}</li>
          <li data-i18n="gearShuttles">${t(lang, 'gearShuttles')}</li>
          <li data-i18n="gearLav">${t(lang, 'gearLav')}</li>
          <li data-i18n="gearShotgun">${t(lang, 'gearShotgun')}</li>
        </ul>
      </section>

      <section class="section" id="showreel">
        <div class="section__head">
          <h2 class="reveal" data-i18n="showreelTitle">${t(lang, 'showreelTitle')}</h2>
          <p class="section__lead reveal" data-i18n="showreelLead">${t(lang, 'showreelLead')}</p>
        </div>
        ${showreelBlock(lang)}
      </section>

      <section class="section section--soft" id="projects">
        <div class="section__head">
          <h2 class="reveal" data-i18n="projectsTitle">${t(lang, 'projectsTitle')}</h2>
          <p class="section__lead reveal" data-i18n="projectsLead">${t(lang, 'projectsLead')}</p>
        </div>
        <div class="yt-projects">
          ${projectsBlock(lang)}
        </div>
      </section>

      <section class="section section--contact" id="contact">
        <div class="section__head">
          <h2 class="reveal" data-i18n="contactTitle">${t(lang, 'contactTitle')}</h2>
          <p class="section__lead reveal" data-i18n="contactLead">${t(lang, 'contactLead')}</p>
        </div>
        <div class="contact-actions reveal">${contactButtons(lang)}</div>
      </section>
    </main>

    <footer class="site-footer">
      <span data-i18n="brand">${t(lang, 'brand')}</span>
      <span data-i18n="footerCredit">${t(lang, 'footerCredit')}</span>
    </footer>
  `

  bindLangButtons()
  bindCarousels()
  observeReveals()
}

function bindLangButtons() {
  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.getAttribute('data-lang')
      setLocale(next)
      render(next)
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
    })
  })
}

function bindCarousels() {
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-carousel-track]')
    const prev = carousel.querySelector('[data-carousel-prev]')
    const next = carousel.querySelector('[data-carousel-next]')
    if (!track || !prev || !next) return

    const step = () => {
      const slide = track.querySelector('.carousel__slide')
      if (!slide) return 240
      const styles = getComputedStyle(track)
      const gap = parseFloat(styles.columnGap || styles.gap || '12') || 12
      return slide.getBoundingClientRect().width + gap
    }

    prev.addEventListener('click', () => {
      track.scrollBy({ left: -step(), behavior: 'smooth' })
    })
    next.addEventListener('click', () => {
      track.scrollBy({ left: step(), behavior: 'smooth' })
    })
  })
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
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  )
  nodes.forEach((el) => io.observe(el))
}

render(detectLocale())
