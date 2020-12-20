const settings = require("../settings.json");
const daily = require(settings.daily);
const Discord = require(settings.discord);
const fs = require(settings.fs);
const money = require(settings.money);
const ms = require(settings.ms);
const cooldowns = require(settings.cooldown);

module.exports.run = async (client, message, args) => {
    let timeout = daily.timeout;
    let reward = Math.floor(Math.random() * daily.range);

    let embed = new Discord.MessageEmbed();
    embed.setTitle(daily.title);

    if (!money[message.author.id]) {
        money[message.author.id] = {
            name: client.user.cache.get(message.author.id).tag,
            money: reward,
        };
        fs.writeFile(settings.moneySub, JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });

        if (!cooldowns[message.author.id]) {
            cooldowns[message.author.id] = {
                name: client.users.cache.get(message.author.id).tag,
                daily: Date.now(),
            };
            fs.writeFile(settings.cooldownSub, JSON.stringify(cooldowns), (err) => {
                if (err) console.log(err);
            });
        } else {
            cooldowns[message.author.id].daily = Date.now();
            fs.writeFile(settings.cooldownSub, JSON.stringify(cooldowns), (err) => {
                if (err) console.log(err);
            });
        }
        embed.setDescription(`You collected your ${daily.context} of ${reward}. Current balance is ${money[message.author.id].money}.`);
        embed.setColor(daily.collectColor);
        return message.channel.send(embed);
    } else {
        if (!cooldowns[message.author.id]) {
            cooldowns[message.author.id] = {
                name: client.users.cache.get(message.author.id).tag,
                daily: Date.now(),
            };
            fs.writeFile(settings.cooldownSub, JSON.stringify(cooldowns), (err) => {
                if (err) console.log(err);
            });
            money[message.author.id].money += reward;
            fs.writeFile(settings.moneySub, JSON.stringify(money), (err) => {
                if (err) console.log(err);
            });
            embed.setDescription(`You collected your ${daily.context} of ${reward}. Current balance is ${money[message.author.id].money}.`);
            embed.setColor(daily.collectColor);
            return message.channel.send(embed);
        } else {
            if (timeout - (Date.now() - cooldowns[message.author.id].daily) > 0) {
                let time = ms(timeout - (Date.now() - cooldowns[message.author.id].daily));
                embed.setColor(daily.collectedColor);
                embed.setDescription(`**You already collected your ${daily.context}!**`);
                embed.addField(`Collect again in`, `**${time.hours}h ${time.minutes}m ${time.seconds}s**`);
                return message.channel.send(embed);
            } else {
                money[message.author.id].money += reward;
                fs.writeFile(settings.moneySub, JSON.stringify(money), (err) => {
                    if (err) console.log(err);
                });
                fs.writeFile(settings.cooldownSub, JSON.stringify(cooldowns), (err) => {
                    if (err) console.log(err);
                });
                embed.setDescription(`You collected your ${daily.context} of ${reward}. Current balance is ${money[message.author.id].money}.`);
                embed.setColor(daily.collectColor);
                return message.channel.send(embed);
            }
        }
    }
};

module.exports.help = {
    name: "daily",
    aliases: [],
};
