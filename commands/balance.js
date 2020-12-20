const settings = require("../settings.json");
const fs = require(settings.fs);
const money = require(settings.money);

module.exports.run = async (client, message, args) => {
    let user;
    if (!args[0]) {
        user = message.author;
    } else {
        user = message.mentions.users.first() || client.users.get(arg[0]);
    }

    if (!money[user.id]) {
        money[user.id] = {
            name: client.users.cache.get(user.id).tag,
            money: 0,
        };
        fs.writeFile(settings.moneySub, JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });
    }

    return message.channel.send(`${client.users.cache.get(user.id).username} has $${money[user.id].money}.`);
};

module.exports.help = {
    name: "balance",
    aliases: ["bal", "money"],
};
