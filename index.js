import TelegramBot from "node-telegram-bot-api";
import { config } from "dotenv";
import { onStart } from "./src/onStart.js";
import { onCourses } from "./src/onCourses.js";
import { onLocation } from "./src/onLocation.js";
import { onRegister } from "./src/onRegister.js";



const TOKEN = process.env.BOT_TOKEN;

const bot = new TelegramBot(TOKEN, { polling: true });
let userState = {};


bot.on("message", (msg) => {
  console.log(msg);
  const chatId = msg.chat.id;
  const text = msg.text;
  const firstName = msg.chat.first_name;

  if (text == "/start" || text == "Boshlash 🔥"  || text == "⬅️ Orqaga") {
       onStart(chatId, firstName);
  } else if (text == "📚 Kurslar") {
    console.log("test");
       onCourses(chatId );
  } else if (text == "ℹ️ Markaz haqida" || text == "📍 Manzil") {
    const latitude = 41.3871008;
    const longitude = 60.3624996;
       onLocation(chatId, latitude, longitude);
  }else if (text ==  "✍️ Ro‘yxatdan o‘tish") {
        const userExists = usersData.some((user) => user.chatId === chatId);
    console.log("exists: ", userExists);
       onRegister(chatId);

    if (!userExists) {
      usersData = [
        ...usersData,
        { chatId: chatId, firstName: firstName, admin: false },
      ];
    }

    console.log(usersData);
    bot.sendMessage(chatId, `Tabriklaymiz, siz ro'yhatdan o'tdingiz! ✅`);

    usersData.forEach((user) => {
      console.log(`user: ${user.firstName}`);
      if (user.admin == true) {
        bot.sendMessage(
          user.chatId,
          `Yangi xabar ✅\n-User: ${firstName}\n-chatId:${chatId}\n**********`
        );
      }
    });
  }if (text ===  "💬 Fikr bildirish") {
  bot.sendMessage(chatId, "✍️ Fikringizni yozib qoldiring.\n\nBiz uni albatta ko‘rib chiqamiz!", {
    reply_markup: {
      remove_keyboard: true
    }
  });

  // Shu foydalanuvchini "fikr yozish" rejimiga o'tkazamiz
  userState[chatId] = "writing_feedback";
  return;
}

// Agar foydalanuvchi fikr bildirish rejimida bo‘lsa:
if (userState[chatId] === "writing_feedback") {

  // Fikr matni
  const feedback = text;

  // Admin chat ID ni o'zingizniki bilan almashtirasiz
  const adminId = 123456789;




  // Adminlarga jo‘natish
  bot.sendMessage(adminId, 
    `🆕 Yangi fikr:\n\n${feedback}\n\n👤 Foydalanuvchi: ${chatId}`
  );

  // Foydalanuvchiga tasdiq javobi
  bot.sendMessage(chatId, 
    "✅ Fikringiz uchun rahmat!\nU albatta ko‘rib chiqiladi.", 
    {
      reply_markup: {
        keyboard: [
          ["📚 Kurslar", "ℹ️ Biz haqimizda"],
          ["📍 Manzil", "📞 Kontaktlar"],
          ["💬 Fikr bildirish"]
        ],
        resize_keyboard: true
      }
    }
  );

  // Rejimni o‘chiramiz
  delete userState[chatId];

  return;
}// ❓ Yordam bo‘limi
if (text === "❓ Yordam") {
  bot.sendMessage(chatId,
    "🆘 *Yordam bo‘limi*\n\n" +
    "Quyidagi bo‘limlardan birini tanlang yoki savolingizni yozib qoldiring:",
    {
      parse_mode: "Markdown",
      reply_markup: {
        keyboard: [
          ["📚 Kurslar haqida savol", "📝 Ro‘yxatdan o‘tish bo‘yicha savol"],
          ["💰 Narxlar bo‘yicha savol"],
          ["⬅️ Orqaga"]
        ],
        resize_keyboard: true
      }
    }
  );

  userState[chatId] = "help_mode";
  return;
}

// Agar foydalanuvchi YORDAM rejimida bo‘lsa:
if (userState[chatId] === "help_mode") {

  // Admin ID (o'zingizniki bilan almashtirasiz)
  const adminId = 123456789;

  // Foydalanuvchining savoli
  const question = text;

  // Adminlarga yuborish
  bot.sendMessage(adminId,
    `🆘 *Yangi yordam so‘rovi*\n\n` +
    `📩 Savol: ${question}\n` +
    `👤 Foydalanuvchi ID: ${chatId}`,
    { parse_mode: "Markdown" }
  );

  // Foydalanuvchiga javob
  bot.sendMessage(chatId,
    "✅ Savolingiz qabul qilindi!\n"
    + "Tez orada siz bilan bog‘lanamiz.",
    {
      reply_markup: {
        keyboard: [
          ["📚 Kurslar", "ℹ️ Biz haqimizda"],
          ["📍 Manzil", "📞 Kontaktlar"],
          ["💬 Fikr bildirish", "❓ Yordam"]
        ],
        resize_keyboard: true
      }
    }
  );

  delete userState[chatId];
  return;
}// ℹ️ Biz haqimizda
if (text === "ℹ️ Biz haqimizda") {
  bot.sendMessage(
    chatId,
    "📘 *Biz haqimizda*\n\n" +
    "O'quv markazimiz o'quvchilarga zamonaviy kasblar, IT bo‘yicha bilimlar va mustahkam tayyorgarlikni taqdim etadi.\n\n" +
    "🎯 *Bizning maqsad:* sifatli, amaliy va zamonaviy ta’lim berish.\n\n" +
    "🚀 *Kurslar:* Frontend, Backend, Grafik dizayn, Ingliz tili, SMM, Foundation va boshqalar.\n\n" +
    "📈 O‘quvchilarimiz real loyihalar asosida o‘qitiladi va yakunda portfolio shakllantiriladi.\n\n" +
    "Agar sizda savollar bo‘lsa, marhamat savol yo‘llashingiz mumkin.",
    {
      parse_mode: "Markdown",
      reply_markup: {
        keyboard: [
          ["📚 Kurslar", "📞 Kontaktlar"],
          ["📍 Manzil", "❓ Yordam"],
          ["⬅️ Orqaga"]
        ],
        resize_keyboard: true
      }
    }
  );

  return;
}// 📞 Kontaktlar
if (text === "📞 Kontaktlar") {
  bot.sendMessage(
    chatId,
    "📞 *Kontaktlar*\n\n" +
    "Telefon: +998 91 798 36 06\n" +
    "Telegram: @manager_100x\n" +
    "Instagram: instagram.com/your_center\n" +
    "Email: info@yourcenter.uz\n\n" +
    "Biz bilan bog‘lanishingiz mumkin:",
    {
      parse_mode: "Markdown",
      reply_markup: {
        keyboard: [
          [{ text: "📲 Qo‘ng‘iroq qilish", url: "tel:+998901234567" }],
          ["📍 Manzil", "❓ Yordam"],
          ["⬅️ Orqaga"]
        ],
        resize_keyboard: true
      }
    }
  );

  return;
}else {
    bot.sendMessage(chatId,
      `
    ⚠️ Kechirasiz, men sizning xabaringizni tushunmadim.

Iltimos, quyidagi tugmani bosing 👇
/start
    `
    );
  }
});

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data == "course_english") {
    bot.sendMessage(
      chatId,
      `
     🇬🇧 Ingliz tili kursi haqida:

📆 Davomiyligi: 3 oy  
⏰ Darslar: Haftasiga 3 marta (1,5 soatdan)  
👨‍🏫 O‘qituvchi: Tajribali filologlar  
💰 Narxi: 350 000 so‘m / oy

Madina, [11/19/2025 9:54 PM]


✍️ Agar sizni bu kurs qiziqtirsa, “Ro‘yxatdan o‘tish” tugmasini bosing.
 `,
      {
        reply_markup: {
          keyboard: [
            [{ text: "✍️ Ro‘yxatdan o‘tish" }],
            [{ text: "⬅️ Orqaga" }],
          ],
          resize_keyboard: true,
        },
      }

    );
  } else if (data == "course_russian") {
    bot.sendMessage(
      chatId,
      `
        🇷🇺 Rus tili kursi haqida:

📆 Davomiyligi: 4 oy  
⏰ Darslar: Haftasiga 3 marta (1,5 soatdan)  
👨‍🏫 O‘qituvchi: Tajribali filologlar  
💰 Narxi: 350 000 so‘m / oy

✍️ Agar sizni bu kurs qiziqtirsa, “Ro‘yxatdan o‘tish” tugmasini bosing.

        `,
      {
        reply_markup: {
          keyboard: [
            [{ text: "✍️ Ro‘yxatdan o‘tish" }],
            [{ text: "⬅️ Orqaga" }],
          ],
          resize_keyboard: true,
        },
      }

    );
  } else if (data == "course_math") {
    bot.sendMessage(
      chatId,
      `
        🧮 Matematika kursi haqida:

📆 Davomiyligi: 3 oy  
⏰ Darslar: Haftasiga 3 marta (1,5 soatdan)  
👨‍🏫 O‘qituvchi: Tajribali filologlar  
💰 Narxi: 300 000 so‘m / oy

✍️ Agar sizni bu kurs qiziqtirsa, “Ro‘yxatdan o‘tish” tugmasini bosing.

        `,
      {
        reply_markup: {
          keyboard: [
            [{ text: "✍️ Ro‘yxatdan o‘tish" }],
            [{ text: "⬅️ Orqaga" }],
          ],
          resize_keyboard: true,
        },
      }

    );
  } else if (data == "course_programming") {
    bot.sendMessage(
      chatId,
      `
        💻 Dasturlash kursi haqida:

📆 Davomiyligi: 5 oy  
⏰ Darslar: Haftasiga 3 marta (1,5 soatdan)  
👨‍🏫 O‘qituvchi: Tajribali filologlar  
💰 Narxi: 250 000 so‘m / oy

✍️ Agar sizni bu kurs qiziqtirsa, “Ro‘yxatdan o‘tish” tugmasini bosing.

        `,
      {
        reply_markup: {
          keyboard: [
            [{ text: "✍️ Ro‘yxatdan o‘tish" }],
            [{ text: "⬅️ Orqaga" }],
          ],
          resize_keyboard: true,
        },
      }

    );
  } else if (data == "course_design") {
    bot.sendMessage(
      chatId,
      `
        🎨 Grafik dizayn kursi haqida:

📆 Davomiyligi: 4 oy  
⏰ Darslar: Haftasiga 3 marta (1,5 soatdan)  
👨‍🏫 O‘qituvchi: Tajribali filologlar  
💰 Narxi: 350 000 so‘m / oy

✍️ Agar sizni bu kurs qiziqtirsa, “Ro‘yxatdan o‘tish” tugmasini bosing.

        `,
      {
        reply_markup: {
          keyboard: [
            [{ text: "✍️ Ro‘yxatdan o‘tish" }],
            [{ text: "⬅️ Orqaga" }],
          ],
          resize_keyboard: true,
        },
      }

    );
  }
})

console.log("Bot ishga tushdi...");

export { bot };