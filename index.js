// Essencials
// Import the discord.js module
const Discord = require("discord.js");

// Import config file
const { prefix, token, version } = require("./config.json");

// Create an instance of a Discord client
const client = new Discord.Client();

// Log our bot in using the token from https://discord.com/developers/applications
client.login(token);

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.once('ready', () => {
    console.log("Bot is online " + `${version}`);
    console.log("Connectect as " + client.user.tag);
    client.user.setActivity("Dominik")
    // client.guilds.cache.forEach((guild) => {
    //     console.log(guild.name);
    //     guild.channels.cache.forEach((channel) => {
    //         console.log(` - ${channel.name} ${channel.type} ${channel.id}`);
    //         // test channel id: 759574649042108436
    //     })
    // })
    let testChannel = client.channels.cache.get("759574649042108436");
});

client.on('message', message => {
    // Check if bot have to react on it
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Command without prefix
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    let taggedUser = message.mentions.users.first();
    switch (command) {
        // case "help":
        //     message.channel.send("暂时唯一指令 ~dodo");
        //     break;
        case "arg-info":
            if (!args.length) {
                return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
            }
            message.channel.send(`Command name: ${command}\nArguments: ${args}`);
            break;
        case "server":
            message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
            break;
        case "dodo":
            message.channel.send("Dominik is noob.", {
                tts: true
            })
            break;
        case "ping":
            message.channel.send("Pong");
            break;
        case "nt":
            if (taggedUser == null) return;
            message.channel.send(`${taggedUser}是脑瘫`)
            break;
    }
})