const settings = require("../settings.json");
const Discord = require(settings.discord);
const fs = require(settings.fs);
const money = require(settings.money);
const gamble = require(settings.gamble);

module.exports.run = async (client, message, args) => {
    let bet;
    // Check if player has money
    if (!money[message.author.id] || money[message.author.id].money <= 0) return message.reply(gamble.noMoney);
    // Check the amount the player bets
    if (!args[0]) return message.reply(gamble.noAmount);
    // All in
    if (args[0].toLowerCase() == gamble.all) args[0] = money[message.author.id].money;
    // Check if it is a number
    try {
        bet = parseFloat(args[0]);
    } catch {
        return message.reply(gamble.notANumber);
    }
    // Check whole number
    if (bet != Math.floor(bet)) return message.reply(gamble.notANumber);
    // Check if player have enough money
    if (money[message.author.id].money < bet) return message.reply(gamble.noEnoughMoney);
    // Max bet each time
    if (bet > gamble.maxBet) return message.reply(`${gamble.max} ${gamble.maxbet.toLocalString()}.`);
    // Get one out of array
    let pick = gamble.chances[Math.floor(Math.random() * gamble.chances.length)];
    if (pick == gamble.lose) {
        money[message.author.id].money -= bet;
        fs.writeFile(settings.moneySub, JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });
        return message.reply(`${gamble.youLose} ${gamble.newBal} $${money[message.author.id].money}`);
    } else {
        money[message.author.id].money += bet;
        fs.writeFile(settings.moneySub, JSON.stringify(money), (err) => {
            if (err) console.log(err);
        });
        return message.reply(`${gamble.youWin} ${gamble.newBal} $${money[message.author.id].money}`);
    }
};

module.exports.help = {
    name: "gamble",
    aliases: ["bet"],
};
