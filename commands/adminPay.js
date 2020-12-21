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
    // Check if author is owner
    if (message.author.id != paySettings.ownerId) return message.reply(settings.noPermission);
    // Check order
    if (isNaN(parseInt(args[1]))) return message.channel.send(paySettings.wrongOrder);
    // Define user
    let user = message.mentions.members.first() || bot.users.cache.get(args[0]);
    //Check target user
    if (!user) return message.reply(paySettings.noUser);
    // Find in database
    Data.findOne({ userID: user.id }, (err, userData) => {
        if (err) console.log(err);
        //Check send amount
        if (!args[1]) return message.reply(paySettings.noAmount);
        if (args[1] != Math.floor(args[1])) return message.reply(paySettings.noNumber);
        // If user data not excist
        if (!userData) {
            // Create a new profile
            const newData = new Data({
                name: client.users.cache.get(user.id).username,
                userID: user.id,
                lb: "all",
                money: parseInt(args[1]),
                daily: 0,
            });
            // Save data
            newData.save().catch((err) => console.log(err));
        } else {
            // Add to user
            userData.money += parseInt(args[1]);
            // Save data
            userData.save().catch((err) => console.log(err));
        }
        return message.channel.send(`${message.author.username} admin payed $${args[1]} to ${client.users.cache.get(user.id).username}.`);
    });
};

module.exports.help = {
    name: "adminpay",
    aliases: ["ap", "give"],
};
