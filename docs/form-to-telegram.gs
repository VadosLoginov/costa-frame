/**
 * Costa Frame — ответы Google Form → Telegram @vados_ai
 *
 * ВАЖНО: скрипт должен быть открыт ИЗ ФОРМЫ:
 *   Форма → ⋮ → Скрипты Apps Script
 * Не создавай отдельный пустой проект на script.google.com.
 *
 * После вставки:
 * 1) Подставь BOT_TOKEN и CHAT_ID
 * 2) Выполни testMessage — должно прийти в Telegram
 * 3) Выполни setupTrigger — один раз
 * 4) Заполни тестовую заявку в форме
 */

const BOT_TOKEN = 'PASTE_BOT_TOKEN_HERE'
// Число из @userinfobot, БЕЗ кавычек тоже можно: 123456789
const CHAT_ID = 'PASTE_CHAT_ID_HERE'

/** Проверка: бот + chat_id. Запусти это первым. */
function testMessage() {
  const me = callTelegram('getMe')
  Logger.log('Bot OK: @' + (me.result && me.result.username))

  sendTelegram('🧪 Тест Costa Frame → Telegram OK')
  Logger.log('Сообщение отправлено. Смотри Telegram.')
}

/** Установи триггер «при отправке формы». */
function setupTrigger() {
  const form = FormApp.getActiveForm()
  if (!form) {
    throw new Error(
      'Скрипт открыт не из формы. Закрой Apps Script, открой Google-форму → ⋮ → Скрипты Apps Script, вставь код туда.',
    )
  }

  ScriptApp.getProjectTriggers().forEach((t) => ScriptApp.deleteTrigger(t))

  ScriptApp.newTrigger('onFormSubmit').forForm(form).onFormSubmit().create()

  Logger.log('Триггер создан для формы: ' + form.getTitle())
  sendTelegram('✅ Costa Frame: уведомления о заявках подключены.\nФорма: ' + form.getTitle())
}

/** Триггер: новая заявка → Telegram. */
function onFormSubmit(e) {
  const lines = ['🎬 <b>Новая заявка — Costa Frame</b>', '']

  if (e && e.response) {
    e.response.getItemResponses().forEach((item) => {
      const title = escapeHtml(item.getItem().getTitle())
      let answer = item.getResponse()
      if (Array.isArray(answer)) answer = answer.join(', ')
      answer = escapeHtml(String(answer || '—'))
      lines.push('<b>' + title + '</b>\n' + answer)
      lines.push('')
    })
    lines.push('🕐 ' + formatDate(e.response.getTimestamp()))
  } else {
    lines.push('Не удалось прочитать ответы.')
  }

  sendTelegram(lines.join('\n'))
}

function sendTelegram(text) {
  assertSecrets()
  const data = callTelegram('sendMessage', {
    chat_id: String(CHAT_ID).trim(),
    text: text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  })
  if (!data.ok) {
    throw new Error('Telegram: ' + JSON.stringify(data))
  }
}

function callTelegram(method, payload) {
  assertSecrets()
  const url = 'https://api.telegram.org/bot' + BOT_TOKEN.trim() + '/' + method
  const options = {
    method: payload ? 'post' : 'get',
    muteHttpExceptions: true,
  }
  if (payload) {
    options.contentType = 'application/json'
    options.payload = JSON.stringify(payload)
  }
  const res = UrlFetchApp.fetch(url, options)
  const body = res.getContentText()
  const code = res.getResponseCode()
  Logger.log(method + ' HTTP ' + code + ': ' + body)
  if (code !== 200) {
    throw new Error(
      method +
        ' failed HTTP ' +
        code +
        '. Частые причины: неверный токен; не нажали Start у бота; неверный CHAT_ID. Ответ: ' +
        body,
    )
  }
  return JSON.parse(body)
}

function assertSecrets() {
  if (!BOT_TOKEN || BOT_TOKEN.indexOf('PASTE_') === 0) {
    throw new Error('Вставь BOT_TOKEN в скрипт (токен от BotFather)')
  }
  if (!CHAT_ID || String(CHAT_ID).indexOf('PASTE_') === 0) {
    throw new Error('Вставь CHAT_ID в скрипт (число из @userinfobot)')
  }
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function formatDate(d) {
  return Utilities.formatDate(d, 'Europe/Madrid', 'dd.MM.yyyy HH:mm')
}
