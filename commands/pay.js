const settings = require("../settings.json");
const paySettings = require(settings.paySettings);
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
    // Check order
    if (isNaN(parseInt(args[1]))) return message.channel.send(paySettings.wrongOrder);
    // Define user
    let user = message.mentions.members.first() || bot.users.cache.get(args[0]);
    //Check target user
    if (!user) return message.reply(paySettings.noUser);
    // Check self pay
    if (user.id == message.author.id) return message.reply(paySettings.selfPay);
    // Find in database
    Data.findOne({ userID: message.author.id }, (err, authorData) => {
        if (err) console.log(err);
        // If authr data not exist
        if (!authorData) {
            return message.reply(paySettings.noMoney);
        } else {
            Data.findOne({ userID: user.id }, (err, userData) => {
                if (err) console.log(err);
                //Check send amount
                if (!args[1]) return message.reply(paySettings.noAmount);
                // Check if user have enough money or wants to send negative
                if (parseInt(args[1]) > authorData.money) return message.reply(paySettings.noEnoughMoney);
                if (parseInt(args[1]) < paySettings.minPayAmount) return message.reply(`You can not pay lesser than $${paySettings.minPayAmount}.`);
                if (args[1] != Math.floor(args[1])) return message.reply(paySettings.noNumber);
                if (!userData) {
                    // Create a new profile
                    const newData = new Data({
                        name: client.users.cache.get(user.id).username,
                        userID: user.id,
                        lb: "all",
                        money: parseInt(args[1]),
                        daily: 0,
                    });
                    authorData.money -= parseInt(args[1]);
                    // Save data
                    newData.save().catch((err) => console.log(err));
                    authorData.save().catch((err) => console.log(err));
                } else {
                    // Remove from author
                    authorData.money -= parseInt(args[1]);
                    // Add to user
                    userData.money += parseInt(args[1]);
                    // Save data
                    authorData.save().catch((err) => console.log(err));
                    userData.save().catch((err) => console.log(err));
                }
                return message.channel.send(`${message.author.username} payed $${args[1]} to ${client.users.cache.get(user.id).username}.`);
            });
        }
    });
};

module.exports.help = {
    name: "pay",
    aliases: ["transfer"],
};
