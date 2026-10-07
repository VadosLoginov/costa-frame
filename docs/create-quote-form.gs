/**
 * Создаёт опросник Costa Frame в твоём Google-аккаунте.
 *
 * Как запустить:
 * 1. Открой https://script.google.com → Новый проект
 * 2. Удали код в редакторе, вставь этот файл целиком
 * 3. Нажми «Выполнить» → разреши доступ к Forms
 * 4. Внизу: Вид → Журналы — скопируй Published URL
 * 5. Пришли ссылку сюда (или вставь в src/config.js → quoteFormUrl)
 */
function createCostaFrameQuoteForm() {
  const form = FormApp.create('Costa Frame — расчёт проекта')
  form
    .setDescription(
      'Короткий опрос по съёмке в Коста-Бланке. После ответов пришлём базовый расчёт.',
    )
    .setCollectEmail(false)
    .setAllowResponseEdits(false)
    .setAcceptingResponses(true)

  form.addTextItem().setTitle('Имя').setRequired(true)

  form
    .addTextItem()
    .setTitle('Контакт для связи')
    .setHelpText('Телефон, WhatsApp или email')
    .setRequired(true)

  form
    .addMultipleChoiceItem()
    .setTitle('Тип съёмки')
    .setChoiceValues(['Камера', 'Дрон', 'Камера + дрон', 'Пока не уверен(а)'])
    .setRequired(true)

  form
    .addMultipleChoiceItem()
    .setTitle('Нужен монтаж?')
    .setChoiceValues(['Да, с монтажом', 'Нет, только материал', 'Частично / обсудим'])
    .setRequired(true)

  form
    .addCheckboxItem()
    .setTitle('Формат проекта')
    .setChoiceValues([
      'Контент для соцсетей / рилсы',
      'YouTube / длинное видео',
      'Событие / торжество',
      'Подкаст / интервью',
      'Beauty / бренд',
      'Семейная съёмка',
      'Другое',
    ])
    .setRequired(true)

  form
    .addMultipleChoiceItem()
    .setTitle('Ориентировочная длительность съёмки')
    .setChoiceValues([
      '2 часа (минимум)',
      '3–4 часа',
      'Полный день (6–8 часов)',
      'Несколько дней',
      'Пока сложно сказать',
    ])
    .setRequired(true)

  form
    .addTextItem()
    .setTitle('Локация')
    .setHelpText('Город / район Коста-Бланки или «выезд уточним»')

  form
    .addTextItem()
    .setTitle('Желаемые даты')
    .setHelpText('Конкретные дни или «гибко»')

  form
    .addParagraphTextItem()
    .setTitle('Кратко о задаче')
    .setHelpText('Что снимаем, сколько роликов, есть ли референсы')

  form
    .addMultipleChoiceItem()
    .setTitle('Бюджет (ориентир)')
    .setChoiceValues([
      'До 300 €',
      '300–600 €',
      '600–1000 €',
      '1000+ €',
      'Пока без рамки — нужен расчёт',
    ])

  const publishedUrl = form.getPublishedUrl()
  const editUrl = form.getEditUrl()

  Logger.log('Published URL: ' + publishedUrl)
  Logger.log('Edit URL: ' + editUrl)

  // Показывает ссылки во всплывающем окне после выполнения
  return { publishedUrl, editUrl }
}
