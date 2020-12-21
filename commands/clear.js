const settings = require("../settings.json");
const clearSettings = require(settings.clearSettings);

module.exports.run = async (client, message, args) => {
    // No premission
    if (!message.member.hasPermission(settings.manageMessage)) return message.reply(settings.noPermission);
    // Check if argument is given
    if (!args[0]) return message.reply(clearSettings.amount);
    // If amount given is greater than max
    if (parseInt(args[0]) > clearSettings.max) return message.reply(`You can not delete more than ${clearSettings.max} messages.`);
    // Delete message plus bot message it self
    message.channel
        .bulkDelete(parseInt(args[0]) + 1)
        .then(() => {
            message.channel.send(`Cleared ${args[0]} messages!`).then((msg) => msg.delete({ timeout: clearSettings.timeout }));
        })
        .catch((err) => {
            // If error
            return message.reply(settings.err);
        });
};

module.exports.help = {
    name: "clear",
    aliases: [],
};
