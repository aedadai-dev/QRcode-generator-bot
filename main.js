const Telegram = require('node-telegram-bot-api')
const ini = require('ini')
const QRCode = require('qrcode')
const fs = require('fs')
const path = require('path')
const configPath = path.join(__dirname, 'config.ini')
const config = ini.parse(fs.readFileSync(configPath, 'utf-8'))

const token = config.telegram.token

const bot = new Telegram(token, { polling: true })
console.log('Бот запущен')

bot.on('message', async (msg) => {
    text = msg.text
    chatId = msg.chat.id
    if (text === '/start') {
        bot.sendMessage(chatId, 'Привет! Я бот для создания QR кодов. Просто пришли мне текст, я сгенерирую QR код для тебя.')
    }
    if (text != '/start') {
        try {
            const statusMsg = await bot.sendMessage(chatId, `Генерирую QR-код...`)

            const qrBuffer = await QRCode.toBuffer(text, {
                type: 'png',
                width: 400,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                },
                errorCorrectionLevel: 'M'
            })
            await bot.deleteMessage(chatId, statusMsg.message_id)
            await bot.sendPhoto(chatId, qrBuffer, {
                caption: `QR код для текста: ${text}`
            })
        } catch (error) {
            await bot.sendMessage(chatId, `Ошибка: ${error.message}`)
        }
    }
})