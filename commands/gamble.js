const settings = require("../settings.json");
const Discord = require(settings.discord);
const fs = require(settings.fs);
const money = require(settings.money);
const gambleSettings = require(settings.gambleSettings);

module.exports.run = async (client, message, args) => {
    let bet;
    // Check if player has money
    if (!money[message.author.id] || money[message.author.id].money <= 0) return message.reply(gambleSettings.noMoney);
    // Check the amount the player bets
    if (!args[0]) return message.reply(gambleSettings.noAmount);
    // All in
    if (args[0].toLowerCase() == gambleSettings.all) args[0] = money[message.author.id].money;
    // Check if it is a number
    try {
        bet = parseFloat(args[0]);
    } catch {
        return message.reply(gambleSettings.notANumber);
    }
    // Check whole number
    if (bet != Math.floor(bet)) return message.reply(gambleSettings.notANumber);
    // Check if player have enough money
    if (money[message.author.id].money < bet || money[message.author.id].money <= 0) return message.reply(gambleSettings.noEnoughMoney);
    // Max bet each time
    if (bet > gambleSettings.maxBet) return message.reply(`${gambleSettings.max} ${gambleSettings.maxBet.toLocaleString()}.`);
    if (bet < gambleSettings.minBet) return message.reply(`${gambleSettings.min} ${gambleSettings.minBet.toLocaleString()}.`);
    // Get one out of array
    let pick = gambleSettings.chances[Math.floor(Math.random() * gambleSettings.chances.length)];
    if (pick == gambleSettings.lose) {
        money[message.author.id].money -= bet;
        fs.writeFile(settings.moneySub, JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });
        return message.reply(`${gambleSettings.youLose} ${gambleSettings.newBal} $${money[message.author.id].money}`);
    } else {
        money[message.author.id].money += bet;
        fs.writeFile(settings.moneySub, JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });
        return message.reply(`${gambleSettings.youWin} ${gambleSettings.newBal} $${money[message.author.id].money}`);
    }
};

module.exports.help = {
    name: "gamble",
    aliases: ["bet"],
};
