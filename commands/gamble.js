const settings = require("../settings.json");
const gambleSettings = require(settings.gambleSettings);
const mongoose = require(settings.mongoose);
const config = require(settings.config);

//Connect to DB
mongoose.connect(config.mongoPass, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Models
const Data = require(settings.dataFile);

module.exports.run = async (client, message, args) => {
    // Find in database
    Data.findOne({ userID: message.author.id }, (err, data) => {
        if (err) console.log(err);
        // If data not exist
        if (!data) {
            const newData = new Data({
                name: message.author.username,
                userID: message.author.id,
                lb: "all",
                money: 0,
                daily: 0,
            });
            // Save data
            newData.save().catch((err) => console.log(err));
            // Because user dont have money
            return message.channel.send(gambleSettings.noMoney);
        } else {
            // If data exist
            let bet;
            // Check if player has money
            if (data.money <= 0) return message.reply(gambleSettings.noMoney);
            // Check the amount the player bets
            if (!args[0]) return message.reply(gambleSettings.noAmount);
            // All in
            if (args[0].toLowerCase() == gambleSettings.all) args[0] = data.money;
            // Check if it is a number
            try {
                bet = parseFloat(args[0]);
            } catch {
                return message.reply(gambleSettings.notANumber);
            }
            // Check whole number
            if (bet != Math.floor(bet)) return message.reply(gambleSettings.notANumber);
            // Check if player have enough money
            if (data.money < bet || data.money <= 0) return message.reply(gambleSettings.noEnoughMoney);
            // Max bet each time
            if (bet > gambleSettings.maxBet) return message.reply(`${gambleSettings.max} ${gambleSettings.maxBet.toLocaleString()}.`);
            if (bet < gambleSettings.minBet) return message.reply(`${gambleSettings.min} ${gambleSettings.minBet.toLocaleString()}.`);
            // Get one out of array
            let pick = gambleSettings.chances[Math.floor(Math.random() * gambleSettings.chances.length)];
            if (pick == gambleSettings.lose) {
                data.money -= bet;
                // Same in database
                data.save().catch((err) => console.log(err));
                // Current money
                return message.reply(`${gambleSettings.youLose} ${gambleSettings.newBal} $${data.money}`);
            } else {
                data.money += bet;
                // Same in database
                data.save().catch((err) => console.log(err));
                // Current money
                return message.reply(`${gambleSettings.youWin} ${gambleSettings.newBal} $${data.money}`);
            }
        }
    });
};

module.exports.help = {
    name: "gamble",
    aliases: ["bet"],
};
