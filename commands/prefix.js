const settings = require("../settings.json");
const Discord = require(settings.discord);
const fs = require(settings.fs);
const colors = require(settings.colors);
const config = require(settings.config);
const prefixSettings = require(settings.prefixSettings);

module.exports.run = async (client, message, args) => {
    // Get the prefix
    let prefixes = JSON.parse(fs.readFileSync(settings.prefixesSub, settings.encoding));
    if (!prefixes[message.guild.id]) {
        prefixes[message.guild.id] = {
            prefix: config.prefix,
        };
    }
    let prefix = prefixes[message.guild.id].prefix;
    // Check permission
    if (!message.member.hasPermission(settings.manageGuild)) return message.reply(settings.noPermission);
    // No argument is given
    if (!args[0]) return message.reply(prefixSettings.noPrefix);
    // New prefix
    prefixes[message.guild.id] = {
        prefix: args[0],
    };
    // Save prefix
    fs.writeFile(settings.prefixesSub, JSON.stringify(prefixes), (err) => {
        if (err) console.log(err);
    });
    // Create message
    let embed = new Discord.MessageEmbed();
    embed.setColor(colors.green);
    embed.setTitle(prefixSettings.title);
    embed.setDescription(`${prefixSettings.description} ${args[0]}`);
    // Return message
    message.channel.send(embed);
};

module.exports.help = {
    name: "prefix",
    aliases: [],
};
