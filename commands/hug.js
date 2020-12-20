const settings = require("../settings.json");
const Discord = require(settings.discord);
const colors = require(settings.colors);
const hugSettings = require(settings.hugSettings);

module.exports.run = async (client, message, args) => {
    // Get a random gif
    let pick = hugSettings.gifs[Math.floor(Math.random() * hugSettings.gifs.length)];
    let embed = new Discord.MessageEmbed();
    embed.setColor(colors.purple);
    embed.setImage(pick);

    // if mentions
    if (args[0]) {
        let user = message.mentions.members.first();
        embed.setTitle(`${message.author.username} hugs ${client.users.cache.get(user.id).username}!`);
    } else {
        embed.setTitle(`${message.author.username} wants a hug.`);
    }
    // Send the message
    message.channel.send(embed);
};

module.exports.help = {
    name: "hug",
    aliases: [],
};
