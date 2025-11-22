import { bot } from "../index.js"

function onLocation(chatId, latitude,  longitude) {
    console.log(`OnLocation...!`);
    
    bot.sendMessage(chatId, "📍 Bizning o‘quv markaz joylashuvi:");
    bot.sendLocation(chatId, latitude, longitude);
}
export{ onLocation };
