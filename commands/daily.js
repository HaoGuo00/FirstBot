const settings = require("../settings.json");
const Discord = require(settings.discord);
const ms = require(settings.ms);
const dailySettings = require(settings.dailySettings);
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
    // Time to reclaim and Amount
    let timeout = dailySettings.timeout;
    let reward = Math.floor(Math.random() * dailySettings.range);
    // Message when call command
    let embed = new Discord.MessageEmbed();
    embed.setTitle(dailySettings.title);
    // Find in database
    Data.findOne({ userID: message.author.id }, (err, data) => {
        if (err) console.log(err);
        // If data not exist
        if (!data) {
            const newData = new Data({
                name: message.author.username,
                userID: message.author.id,
                lb: "all",
                money: reward,
                daily: Date.now(),
            });
            // Save data
            newData.save().catch((err) => console.log(err));
            return message.channel.send(`${message.author.username} has $${reward}.`);
        } else {
            // If collected
            if (timeout - (Date.now() - data.daily) > 0) {
                //
                let time = ms(timeout - (Date.now() - data.daily));
                // Return message
                embed.setColor(dailySettings.collectedColor);
                embed.setDescription(`**You already collected your ${dailySettings.context}!**`);
                embed.addField(`Collect again in`, `**${time.hours}h ${time.minutes}m ${time.seconds}s**`);
                return message.channel.send(embed);
            } else {
                // Add money
                data.money += reward;
                // New cooldown
                data.daily = Date.now();
                data.save().catch((err) => console.log(err));
                //Message successfull collect
                embed.setDescription(`You collected your ${dailySettings.context} of ${reward}. Current balance is ${data.money}.`);
                embed.setColor(dailySettings.collectColor);
                return message.channel.send(embed);
            }
        }
    });
};

module.exports.help = {
    name: "daily",
    aliases: [],
};
