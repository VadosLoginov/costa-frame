import youtubeProjects from './youtube-projects.json'

/**
 * Costa Frame — contacts & media.
 * Fill telegram when ready. Empty optional fields hide their buttons.
 * YouTube carousel list: src/youtube-projects.json (npm run update:youtube).
 */
export const config = {
  name: 'Vadim Loginov',
  brand: 'Costa Frame',
  photo: '/vadim.jpg',
  aboutUrl: '/about.html',
  phone: '+34624374845',
  email: 'v.loginov.sp@gmail.com',
  telegram: '', // e.g. @username or https://t.me/username
  instagram: '@vados_sp',
  collaboratorInstagram: '@_lena_see',
  showreelUrl: 'https://youtu.be/qtrKLQTNIeY',
  /** Google Form for project quote — paste share URL when ready */
  quoteFormUrl:
    'https://docs.google.com/forms/d/1Y12Yl7vhlQ-HNEIiTH9Sl7sR5WMMRQQczTDa5RG5dJg/viewform',
  /** Show hourly rate cards in the pricing section */
  showPricingRates: false,
  stockLinks: [
    {
      label: 'Shutterstock',
      url: 'https://www.shutterstock.com/g/VadosLoginov/video?sort=newest',
    },
    {
      label: 'Adobe Stock',
      url: 'https://stock.adobe.com/ua/contributor/205515599/vadosloginov',
    },
    {
      label: 'Videohive',
      url: 'https://videohive.net/user/vadosloginov/portfolio',
    },
  ],
  aboutChannels: [
    {
      key: 'asmr',
      url: 'https://www.youtube.com/@BEHIND_THE_SCENES_ASMR',
    },
    {
      key: 'yoga',
      url: 'https://www.youtube.com/@SilentYogaFlow',
    },
  ],
  /**
   * «Для каких проектов» — кликабельные примеры.
   * format: 'portrait' (телефон/рилс) | 'landscape' (широкое 16:9)
   * videoUrl + image: ссылка и превью
   */
  projectTypes: [
    { labelKey: 'usePodcasts', videoUrl: '', image: '', format: 'portrait' },
    {
      labelKey: 'useYoutube',
      videoUrl: 'https://www.youtube.com/@SilentYogaFlow',
      image: '/examples/youtube.jpg',
      format: 'landscape',
    },
    { labelKey: 'useTrainings', videoUrl: '', image: '', format: 'portrait' },
    {
      labelKey: 'useAds',
      videoUrl: 'https://youtu.be/MIvGcAtfz-A',
      image: '',
      format: 'landscape',
    },
    {
      labelKey: 'useBeauty',
      videoUrl: 'https://www.instagram.com/reel/DdqIyUys-QV/',
      image: '/examples/beauty.jpg',
      format: 'portrait',
    },
    {
      labelKey: 'useFamily',
      videoUrl: 'https://www.instagram.com/reel/DcDaA1FqdMU/',
      image: '/examples/family.jpg',
      format: 'landscape',
    },
    {
      labelKey: 'useSocial',
      videoUrl: 'https://www.instagram.com/reel/DciGiztub35/',
      image: '/examples/social.jpg',
      format: 'portrait',
    },
    {
      labelKey: 'useReels',
      videoUrl: 'https://www.instagram.com/reel/DcbiDH1o3Pf/',
      image: '/examples/reels.jpg',
      format: 'portrait',
    },
  ],
  youtubeProjects,
  /**
   * Hero background + carousel screenshots.
   * Drop images into public/hero/ and list paths here, e.g. '/hero/01.jpg'.
   * While empty, YouTube previews are used as a fallback.
   */
  heroImages: [
    '/hero/01.jpg',
    '/hero/02.jpg',
    '/hero/03.jpg',
    '/hero/04.jpg',
    '/hero/05.jpg',
    '/hero/06.jpg',
    '/hero/07.jpg',
    '/hero/08.jpg',
    '/hero/09.jpg',
    '/hero/10.jpg',
    '/hero/11.jpg',
  ],
}
