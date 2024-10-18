require('dotenv').config()
const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.MESSAGE_CONTENT,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MEMBERS
    ], 
});

const slashCommands = [
    {
        name: 'whitelist',
        description: 'whitelist for the server',
    },
    {
        name: 'info',
        description: 'Basic info about Satelite.im',
    },
    {
        name: 'uplink',
        description: 'Info about our app Uplink',
    },
    {
        name: 'warp',
        description: 'Info about our service Warp',
    },
    {
        name: 'socials',
        description: 'Our social media links',
    },
    {
        name: 'mute',
        description: 'mute server member',
        options: [
            {
                name: 'user',
                description: 'Member you want to mute',
                type: 6,
                required: true,
            },
            {
                name: 'reason',
                description: 'Mute reason',
                type: 3,
                required: false,
            },
        ],
    },
    {
        name: 'unmute',
        description: 'Unmute member',
        options: [
            {
                name: 'user',
                description: 'Member that you want to unmute',
                type: 6,
                required: true,
            },
        ],
    },
    {
        name: 'warn',
        description: 'Warn member',
        options: [
            {
                name: 'user',
                description: 'Member that you want to warn',
                type: 6,
                required: true,
            },
            {
                name: 'reason',
                description: 'Warn reason',
                type: 3,
                required: false,
            },
        ],
    },
    {
        name: 'test',
        description: 'Test command',
    }
];

client.once('ready', async () => {
    client.user.setActivity('Satellite.im', { type: 'WATCHING' });

    for (const command of slashCommands) {
        const commandData = {
            name: command.name,
            description: command.description,
        };

        if (command.options) {
            commandData.options = command.options;
        }

        await client.guilds.cache.get(process.env.guild)?.commands.create(commandData);
    }
});

client.on("guildMemberAdd", (member) => {
	if(member.guild.id !== process.env.guild) return;
	let channel = client.channels.cache.get(process.env.welcomechannel);
	const joinembed = new Discord.MessageEmbed()
		.setColor(process.env.color)
		.setAuthor({ name: process.env.server_name, iconURL: process.env.logolink})
		.setThumbnail(process.env.logolink)
		.addFields(
			{ name: 'Rules', value: `Thank you for reading and accepting our rules, you can find it in <#${process.env.ruleschannel}> channel` },
			{ name: 'Info', value: `To find more info about us use the command /info in any channel`},
		)
		.setTimestamp()
		.setFooter({ text: process.env.server_name, iconURL: process.env.logolink });
		channel.send({ content: `${member.user} Welcome to ${process.env.server_name} discord server, we hope you will have a great time with us`, embeds: [joinembed] });
});

// Whitelist
client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        const buttonID = interaction.customId;
        if (buttonID === 'whitelistButton') {
            const member = interaction.member;

            if (!member.roles.cache.has(`${process.env.memberrole}`)) {
                member.roles.add(`${process.env.memberrole}`);
                return interaction.reply({
                    content: 'You have recieved the whitelist role',
                    ephemeral: true
                });
            } else {
                return interaction.reply({
                    content: 'You already have the whitelist role',
                    ephemeral: true
                })
            }
        }
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'whitelist') {
        if (!interaction.member.permissions.has('KICK_MEMBERS')) {
            return interaction.reply('You dont have access to this ofc. :P');
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('whitelistButton')
                    .setLabel('I accept the rules and agree to them')
                    .setStyle('SUCCESS')
                    .setEmoji("✅")
            );

        const rulesembed = new Discord.MessageEmbed()
            .setColor(process.env.color)
            .setTitle('Satellite.im Rules')
            .setAuthor({
                name: process.env.server_name,
                iconURL: process.env.logolink
            })
            .setDescription(`
                1. Keep politics out of the discord.\n
                2. Keep chat relevant. Please do NOT use <#${process.env.satellitechannel}> for random chat. Use <#${process.env.satellitechannel}> to ask questions about the application, talk about new features, or talk DIRECTLY about the chat.\n
                3. Keep random chat to <#${process.env.offtopicchannel}> This allows people coming into the community to learn about the app to avoid leaving after being annoyed by random pings. \n
                4. No hate speech, racism, sexism, or any other form of discrimination. \n
                5. No probing for personal information including account & names. People will share this info if they choose to. \n
                6. No spamming. \n
                7. No advertising other project without prior permission from staff members \n
                8. No soliciting us for business request in our server or in our dm's for business inquiry email us at **partnerships@satellite.im** \n
                9. No NSFw or obscene content. This includes text, images or link featuring nudity, sex, hard violence, or other graphically disturbing content. \n
                10. Follow the Discord TOS.

                By pressing the button you agree to our rules and will be granted the whitelist role to access the server
            `)
            .setTimestamp()
            .setFooter({ text: process.env.server_name, iconURL: process.env.logolink });
        await interaction.channel.send({
            embeds: [rulesembed],
            components: [row]
        });
    } else if (commandName === 'info') {
        const infoembed = new Discord.MessageEmbed()
            .setColor(process.env.color)
            .setTitle('About Us - Basic Info')
            .setAuthor({
                name: process.env.server_name,
                iconURL: process.env.logolink
            })
            .setDescription(`${interaction.user} Satellite.im info`)
            .addFields(
                { name: `Who are we?`, value: 'We are hard at work experimenting, and finding the best way to build Uplink and Warp, our chat app and interface-driven, distributed data service.' },
                { name: 'Our Vision?', value: `Our mission is to build a communication platform that is secure, private, and easy to use.` },
                { name: 'Our Goal?', value: `Our goal is to build a communication platform that give you peace of mind with end-to-end encryption, without sacrificing quality.` },
                { name: 'Our Limit?', value: `Being peer-to-peer, your only limit is your network own connection.` },
                { name: 'Website?', value: `https://satellite.im` },
                { name: 'Uplink?', value: `For more info about our app Uplink check /uplink` },
                { name: 'Warp?', value: `For more info about our service Warp check /warp` },
                
            )
            .setTimestamp()
            .setFooter({ text: process.env.server_name, iconURL: process.env.logolink });
        await interaction.reply({ embeds: [infoembed], ephemeral: true });
    } else if (commandName === 'uplink') {
        const uplinkembed = new Discord.MessageEmbed()
            .setColor(process.env.color)
            .setTitle('Uplink')
            .setAuthor({
                name: process.env.server_name,
                iconURL: process.env.logolink
            })
            .setDescription(`${interaction.user} Satellite.im Uplink`)
            .addFields(
                { name: `What is Uplink?`, value: 'Uplink is a chat app that is secure, private, and easy to use.' },
                { name: 'Why Uplink?', value: `Have the chat experience you deserve without sacrificing privacy. With Uplink, you control your data and own your own key.` },
                { name: 'Features?', value: `P2P Private Messaging, File sharing, Extensions, Group Chats, and much more` },
                { name: 'Coming Soon', value: `Native Mobile Apps, Extensions Marketplace, Voice & Video, Communities, and much more, find more info on our website` },
                { name: 'How to get Uplink and stay updated?', value: `You can download Uplink from our website https://uplink.satellite.im` },
            )
            .setTimestamp()
            .setFooter({ text: process.env.server_name, iconURL: process.env.logolink });
        await interaction.reply({ embeds: [uplinkembed], ephemeral: true });
    } else if (commandName === 'warp') {
        const warpembed = new Discord.MessageEmbed()
            .setColor(process.env.color)
            .setTitle('Warp')
            .setAuthor({
                name: process.env.server_name,
                iconURL: process.env.logolink
            })
            .setDescription(`${interaction.user} Satellite.im Warp`)
            .addFields(
                { name: `What is Warp used for?`, value: 'Warp is a service that can run as a single binary, providing an interface to the core technologies that run Satellite.' },
                { name: 'Why did we build Warp?', value: ` This allows us to avoid rewriting the same tech over and over when developing for different platforms.` },
                { name: 'Warp compatibility?', value: `Warp will work on most phones, tablets, computers, and even some consoles.` },
                { name: 'Coming Soon', value: `Native Mobile Apps, Extensions Marketplace, Voice & Video, Communities, and much more, find more info on our website` },
                { name: 'Where can i find more info about Warp?', value: `You can find more info about Warp on our website https://warp.satellite.im` },
            )
            .setTimestamp()
            .setFooter({ text: process.env.server_name, iconURL: process.env.logolink });
        await interaction.reply({ embeds: [warpembed], ephemeral: true });
    } else if (commandName === 'mute') {
        if (!interaction.member.permissions.has('KICK_MEMBERS')) {
            return interaction.reply('You dont have access to this ofc. :P');
        }

        const user = interaction.options.get('user').value;
        const member = interaction.guild.members.cache.get(user);

        const reasonOption = options.getString('reason');
        const reason = reasonOption || 'not specified';

        member.roles.add(member.guild.roles.cache.get(process.env.mutedrole));

        await interaction.reply(`${member} is perma muted by ${interaction.user}, reason: ${reason}`);
    } else if (commandName === 'unmute') {
        if (!interaction.member.permissions.has('KICK_MEMBERS')) {
            return interaction.reply('You dont have access to this ofc. :P');
        }

        const user = interaction.options.get('user').value;
        const member = interaction.guild.members.cache.get(user);

        member.roles.remove(member.guild.roles.cache.get(process.env.mutedrole));

        await interaction.reply(`${member} is unmuted by ${interaction.user}`);
    } else if (commandName === "socials") {
        socialsEmbed = new Discord.MessageEmbed()
            .setColor(process.env.color)
            .setTitle('Social Media')
            .setAuthor({
                name: process.env.server_name,
                iconURL: process.env.logolink
            })
            .setDescription('Follow us on our social media')
            .addFields(
                { name: 'Website', value: 'https://satellite.im' },
                { name: 'Uplink', value: 'https://uplink.satellite.im' },
                { name: 'Warp', value: 'https://warp.satellite.im' },
                { name: 'Linkedin', value: 'https://linkedin.com/company/satellite-im' },
                { name: 'Github', value: 'https://github.com/Satellite-im' },
                { name: 'X/Twitter', value: 'https://twitter.com/Satellite_im' },
                { name: 'Medium Blog', value: 'https://medium.com/@satellite-im' },
                { name: 'Partnership', value: 'partnerships@satellite.im' },
            )
            .setTimestamp()
            .setFooter({ text: process.env.server_name, iconURL: process.env.logolink });
        await interaction.reply({ embeds: [socialsEmbed], ephemeral: true });
    } else if (commandName === 'test') {
        await interaction.reply({ content: 'Test command', ephemeral: true });    
    } else if (commandName === 'warn') {
        const user = interaction.options.get('user').value;
        const member = interaction.guild.members.cache.get(user);

        const reasonOption = options.getString('reason');
        const reason = reasonOption || 'not specified';

        const warnembed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle('Satellite.im - Warn System')
        .setAuthor({
            name: process.env.server_name,
            iconURL: process.env.logolink
        })
        .setDescription(`${member} You have been warned by server admin: ${interaction.user} \n Reason: ${reason} \n 
            We would like to remind you to follow the rules of the server and keep up with the good behavior
            This is your first and last warning before further actions are taken.
        `)
        .setTimestamp()
        .setFooter({ text: process.env.server_name, iconURL: process.env.logolink });
        await member.send({ embeds: [warnembed] });

        await interaction.reply(`${member} is warned by ${interaction.user}, reason: ${reason}`);
    }
});

client.login(process.env.token)