// Packages and files
// Import the discord.js module
const Discord = require("discord.js");
// Create an instance of a Discord client
const client = new Discord.Client({ disableEveryone: true });
// Import config file
const config = require("./config.json");
// Read folder
const fs = require("fs");

// Bot commands
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// Read commands folder
fs.readdir("./commands/", (err, files) => {
    if (err) console.log(err);

    let jsfile = files.filter((f) => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
        console.log("Couldn't find any commands!");
        return;
    }

    jsfile.forEach((f) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        client.commands.set(props.help.name, props);

        props.help.aliases.forEach((alias) => {
            client.aliases.set(alias, props.help.name);
        });
    });
});

// Bot online message and activity message
client.on("ready", async () => {
    console.log(`${client.user.username} is online on ${client.guilds.cache.size} servers!`);
    client.user.setActivity(`with ${client.guilds.cache.size} servers!`);
});

client.on("message", async (message) => {
    // Check channel type
    if (message.channel.type === "dm") return;
    if (message.author.bot) return;

    // Set prefix
    const prefix = config.prefix;

    // Check prefix, Define args & command
    if (!message.content.startsWith(prefix)) return;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    let command;
    let commandFile = client.commands.get(cmd.slice(prefix.length));
    if (commandFile) commandFile.run(client, message, args);

    // Run commands
    if (client.commands.has(cmd)) {
        command = client.commands.get(cmd);
    } else if (client.aliases.has(cmd)) {
        command = client.commands.get(client.aliases.get(cmd));
    }
    try {
        command.run(client, message, args);
    } catch (e) {
        return;
    }
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(config.token);

// /**
//  * The ready event is vital, it means that only _after_ this will your bot start reacting to information
//  * received from Discord
//  */
// client.once('ready', () => {
//     console.log("Bot is online " + `${version}`);
//     console.log("Connectect as " + client.user.tag);
//     client.user.setActivity("Dominik")
//     // client.guilds.cache.forEach((guild) => {
//     //     console.log(guild.name);
//     //     guild.channels.cache.forEach((channel) => {
//     //         console.log(` - ${channel.name} ${channel.type} ${channel.id}`);
//     //         // test channel id: 759574649042108436
//     //     })
//     // })
//     let testChannel = client.channels.cache.get("759574649042108436");
// });

// client.on('message', message => {
//     // Check if bot have to react on it
//     if (!message.content.startsWith(prefix) || message.author.bot) return;

//     // Command without prefix
//     const args = message.content.slice(prefix.length).trim().split(/ +/);
//     const command = args.shift().toLowerCase();

//     let taggedUser = message.mentions.users.first();
//     switch (command) {
//         // case "help":
//         //     message.channel.send("暂时唯一指令 ~dodo");
//         //     break;
//         case "arg-info":
//             if (!args.length) {
//                 return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
//             }
//             message.channel.send(`Command name: ${command}\nArguments: ${args}`);
//             break;
//         case "server":
//             message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
//             break;
//         case "dodo":
//             message.channel.send("Dominik is noob.", {
//                 tts: true
//             })
//             break;
//         case "ping":
//             message.channel.send("Pong");
//             break;
//         case "nt":
//             if (taggedUser == null) return;
//             if (message.mentions.users.first().username.includes("QAQ")) {
//                 message.reply("脑瘫闭嘴");
//             } else {
//                 message.channel.send(`${taggedUser}是脑瘫`);
//             }
//             break;
//     }
// })
