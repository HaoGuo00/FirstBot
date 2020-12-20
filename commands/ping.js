module.exports.run = async (client, message, args) => {
    const m = await message.channel.send("Ping");
    m.edit(`Pong! ${m.createdTimestamp - message.createdTimestamp}`);
};

module.exports.help = {
    name: "ping",
    aliases: ["p"],
};
