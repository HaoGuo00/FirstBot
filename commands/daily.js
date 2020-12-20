const settings = require("../settings.json");
const dailySettings = require(settings.dailySettings);
const Discord = require(settings.discord);
const fs = require(settings.fs);
const money = require(settings.money);
const ms = require(settings.ms);
const cooldowns = require(settings.cooldown);

module.exports.run = async (client, message, args) => {
    // Time to reclaim and Amount
    let timeout = dailySettings.timeout;
    let reward = Math.floor(Math.random() * dailySettings.range);
    // Message when call command
    let embed = new Discord.MessageEmbed();
    embed.setTitle(dailySettings.title);

    // If user dont have a account
    if (!money[message.author.id]) {
        money[message.author.id] = {
            name: client.user.cache.get(message.author.id).tag,
            money: reward,
        };
        // Add a account to the player
        fs.writeFile(settings.moneySub, JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });
        // If player do not have a cooldown
        if (!cooldowns[message.author.id]) {
            cooldowns[message.author.id] = {
                name: client.users.cache.get(message.author.id).tag,
                daily: Date.now(),
            };
            // Add the cooldown to the player
            fs.writeFile(settings.cooldownSub, JSON.stringify(cooldowns), (err) => {
                if (err) console.log(err);
            });
        } else {
            // Set cooldown
            cooldowns[message.author.id].daily = Date.now();
            fs.writeFile(settings.cooldownSub, JSON.stringify(cooldowns), (err) => {
                if (err) console.log(err);
            });
        }
        //Message successfull collect
        embed.setDescription(`You collected your ${dailySettings.context} of ${reward}. Current balance is ${money[message.author.id].money}.`);
        embed.setColor(dailySettings.collectColor);
        return message.channel.send(embed);
    } else {
        // If user have a account(money) but do not have a cooldown
        if (!cooldowns[message.author.id]) {
            cooldowns[message.author.id] = {
                name: client.users.cache.get(message.author.id).tag,
                daily: Date.now(),
            };
            // Add cooldown
            fs.writeFile(settings.cooldownSub, JSON.stringify(cooldowns), (err) => {
                if (err) console.log(err);
            });
            // Add money
            money[message.author.id].money += reward;
            fs.writeFile(settings.moneySub, JSON.stringify(money), (err) => {
                if (err) console.log(err);
            });
            //Message successfull collect
            embed.setDescription(`You collected your ${dailySettings.context} of ${reward}. Current balance is ${money[message.author.id].money}.`);
            embed.setColor(dailySettings.collectColor);
            return message.channel.send(embed);
        } else {
            // If user have cooldown and still in cooldown
            if (timeout - (Date.now() - cooldowns[message.author.id].daily) > 0) {
                let time = ms(timeout - (Date.now() - cooldowns[message.author.id].daily));
                embed.setColor(dailySettings.collectedColor);
                embed.setDescription(`**You already collected your ${dailySettings.context}!**`);
                embed.addField(`Collect again in`, `**${time.hours}h ${time.minutes}m ${time.seconds}s**`);
                return message.channel.send(embed);
            } else {
                // If user have cooldown but it over
                // Add money
                money[message.author.id].money += reward;
                fs.writeFile(settings.moneySub, JSON.stringify(money), (err) => {
                    if (err) console.log(err);
                });
                // Change cooldown
                cooldowns[message.author.id].daily = Date.now();
                fs.writeFile(settings.cooldownSub, JSON.stringify(cooldowns), (err) => {
                    if (err) console.log(err);
                });
                //Message successfull collect
                embed.setDescription(
                    `You collected your ${dailySettings.context} of ${reward}. Current balance is ${money[message.author.id].money}.`
                );
                embed.setColor(dailySettings.collectColor);
                return message.channel.send(embed);
            }
        }
    }
};

module.exports.help = {
    name: "daily",
    aliases: [],
};
