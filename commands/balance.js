const fs = require("fs");
const money = require("../money.json")

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
            money: 0
        }
        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });
    }

    return message.channel.send(`${client.users.cache.get(user.id).username} has $${money[user.id].money}.`)
}

module.exports.help = {
    name: "balance",
    aliases: ["bal", "money"]
}