const TelegramBot = require("node-telegram-bot-api");

const TOKEN = "7304904644:AAEvnfwmkGAAH0xv8-2_KDcjAz0jskUpCPg";

const bot = new TelegramBot(TOKEN, { polling: true });

bot.on("message", (msg) => {
    console.log(msg);
    const chatId = msg.chat.id;
     const text = msg.text;
      const firstName = msg.chat.first_name;
    
      if (text == "/start" || text == "Boshlash 🔥" ) {
        bot.sendMessage(
            chatId,
            `
                👋 Assalomu alaykum, ${firstName}!

📚 100x o‘quv markazining rasmiy botiga xush kelibsiz!

Bu bot orqali siz:
• Kurslarimiz haqida batafsil ma’lumot olasiz  
• Kurslarga onlayn ro‘yxatdan o‘tishingiz mumkin  
• Jadval va to‘lovlar haqida ma’lumot olasiz  

Quyidagi menyudan kerakli bo‘limni tanlang 👇
            `,
            {
                reply_markup: {
                    keyboard: [
                        [{text:"📚 Kurslar"}, {text: "✍️ Ro‘yxatdan o‘tish"}],
                        [{ text: "ℹ️ Markaz haqida" }, { text: "💬 Fikr bildirish" }],
                        [{ text: "❓ Yordam" }],
                    ],
                    resize_keyboard: true,
                },
            }
        )
      }
})