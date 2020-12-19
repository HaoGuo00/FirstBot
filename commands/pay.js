const settings = require("../settings.json");
const pay = require(settings.pay);
const money = require(settings.money);
const fs = require(settings.fs);

module.exports.run = async (client, message, args) => {
    if (isNaN(parseInt(args[1]))) return message.channel.send(pay.wrongOrder);
    let user = message.mentions.members.first() || bot.users.cache.get(args[0]);
    //Check target user
    if (!user) return message.reply(pay.noUser);
    //Check send amount
    if (!args[1]) return message.reply(pay.noAmount);
    // Check if user have enough money or wants to send negative 
    if (!money[message.author.id]) return message.reply(pay.noMoney);
    if (parseInt(args[1]) > money[message.author.id].money) return message.reply(pay.noEnoughMoney);
    if (parseInt(args[1]) < pay.minPayAmount) return message.reply(`You can not pay lesser than $${pay.minPayAmount}.`);

    //If recieve user do not have a account
    if (!money[user.id]) {
        money[user.id] = {
            name: client.users.cache.get(user.id).tag,
            money: parseInt(args[1])
        }
        money[message.author.id].money -= parseInt(args[1]);
        //Write to file
        fs.writeFile(settings.moneySub, JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });
    } else {
        // Target user
        money[user.id].money += parseInt(args[1]);
        // Author
        money[message.author.id].money -= parseInt(args[1]);
        //Write to file
        fs.writeFile(settings.moneySub, JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });
    }
    return message.channel.send(`${message.author.username} payed $${args[1]} to ${client.users.cache.get(user.id).username}.`);
}

module.exports.help = {
    name: "pay",
    aliases: ["transfer"]
}