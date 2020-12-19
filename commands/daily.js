const Discord = require("discord.js");
const fs = require("fs");
const money = require("../money.json");
const ms = require("parse-ms");
const cooldowns = require("../cooldown.json");

const settings = require("../settings.json");

module.exports.run = async (client, message, args) => {
    let timeout = settings.timeout;
    let reward = Math.floor(Math.random() * settings.range);;

    let embed = new Discord.MessageEmbed();
    embed.setTitle(settings.title);

    if (!money[message.author.id]) {
        money[message.author.id] = {
            name: client.user.cache.get(message.author.id).tag,
            money: reward
        }
        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });

        if (!cooldowns[message.author.id]) {
            cooldowns[message.author.id] = {
                name: client.users.cache.get(message.author.id).tag,
                daily: Date.now()
            }
            fs.writeFile("./colldowns.json", JSON.stringify(cooldowns), (err) => {
                if (err) console.log(err);
            });
        } else {
            cooldowns[message.author.id].daily = Date.now();
            fs.writeFile("./colldowns.json", JSON.stringify(cooldowns), (err) => {
                if (err) console.log(err);
            });
        }
        embed.setDescription(`You collected your daily reward of ${reward}. Current balance is ${money[message.author.id].money}.`);
        embed.setColor(settings.collectColor);
        return message.channel.send(embed);
    } else {
        if (!cooldowns[message.author.id]) {
            cooldowns[message.author.id] = {
                name: client.users.cache.get(message.author.id).tag,
                daily: Date.now()
            }
            fs.writeFile("./colldowns.json", JSON.stringify(cooldowns), (err) => {
                if (err) console.log(err);
            });
            money[message.author.id].money += reward;
            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if (err) console.log(err);
            });
            embed.setDescription(`You collected your daily reward of ${reward}. Current balance is ${money[message.author.id].money}.`);
            embed.setColor(settings.collectColor);
            return message.channel.send(embed);
        } else {
            if (timeout - (Date.now() - cooldowns[message.author.id].daily) > 0) {
                let time = ms(timeout - (Date.now() - cooldowns[message.author.id].daily));
                embed.setColor(settings.collectedColor);
                embed.setDescription(`**You already collected your daily reward!**`);
                embed.addField(`Collect again in`, `**${time.hours}h ${time.minutes}m ${time.seconds}s**`);
                return message.channel.send(embed);
            } else {
                money[message.author.id].money += reward;
                fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                    if (err) console.log(err);
                });
                fs.writeFile("./colldowns.json", JSON.stringify(cooldowns), (err) => {
                    if (err) console.log(err);
                });
                embed.setDescription(`You collected your daily reward of ${reward}. Current balance is ${money[message.author.id].money}.`);
                embed.setColor(settings.collectColor);
                return message.channel.send(embed);
            }
        }
    }
}

module.exports.help = {
    name: "daily",
    aliases: []
}