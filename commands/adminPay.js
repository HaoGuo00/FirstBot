const settings = require("../settings.json");
const paySettings = require(settings.paySettings);
const money = require(settings.money);
const fs = require(settings.fs);

module.exports.run = async (client, message, args) => {
    // If user is owner
    if (message.author.id != paySettings.ownerId) return message.reply(settings.noPermission);
    if (isNaN(parseInt(args[1])))
        // Check if the user call the function correctly
        return message.channel.send(paySettings.wrongOrder);
    let user = message.mentions.members.first() || bot.users.cache.get(args[0]);
    // Check target user
    if (!user) return message.reply(paySettings.noUser);
    // Check send amount
    if (!args[1]) return message.reply(paySettings.noAmount);
    // If recieve user do not have a account
    if (!money[user.id]) {
        money[user.id] = {
            name: client.users.cache.get(user.id).tag,
            money: parseInt(args[1]),
        };
        money[message.author.id].money -= parseInt(args[1]);
        //Write to file
        fs.writeFile(settings.moneySub, JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });
    } else {
        // Target user
        money[user.id].money += parseInt(args[1]);
        // Write to file
        fs.writeFile(settings.moneySub, JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });
    }
    return message.channel.send(`${message.author.username} admin payed $${args[1]} to ${client.users.cache.get(user.id).username}.`);
};

module.exports.help = {
    name: "adminpay",
    aliases: ["ap", "give"],
};
