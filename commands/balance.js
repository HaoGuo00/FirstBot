const settings = require("../settings.json");
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
    let user;
    if (!args[0]) {
        user = message.author;
    } else {
        user = message.mentions.users.first() || client.users.cache.get(arg[0]);
    }

    Data.findOne(
        {
            userID: user.id,
        },
        (err, data) => {
            if (err) console.log(err);
            // If data not exist
            if (!data) {
                const newData = new Data({
                    name: client.users.cache.get(user.id).username,
                    userID: user.id,
                    lb: "all",
                    money: 0,
                    daily: 0,
                });
                // Save data
                newData.save().catch((err) => console.log(err));
                return message.channel.send(`${client.users.cache.get(user.id).username} has $0.`);
            } else {
                return message.channel.send(`${client.users.cache.get(user.id).username} has $${data.money}.`);
            }
        }
    );
};

module.exports.help = {
    name: "balance",
    aliases: ["bal", "money"],
};
