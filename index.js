require('dotenv').config()
require('module-alias/register');
const path  = require('path');
const fs = require('fs');
const Commando = require('discord.js-commando');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token} = require('./config.json');

const ownerId = process.env.owner_ID
const client = new Commando.Client({
    owner: ownerId,
    commandPrefix: process.env.GLOBAL_PREFIX
})
client.registry
    .registerGroups([
        ['fun', 'Fun commands'],
        ['management', 'Server Management Commands'],
        ['misc', 'Misc Commands'],
        ['moderation', 'Moderation Commands']
    ]).registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('"!help" - for help');
});

// Read and remember all slash commands.
client.commands = new Collection();
const categoryFolders = fs.readdirSync("./commands").filter(file => file.endsWith('_commands'))
for (const category of categoryFolders){
  const commandFiles = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
	  const command = require(`./commands/${category}/${file}`);
	  client.commands.set(command.data.name, command);
} }

// Handle all bot functions invoked via messages here.
client.on("messageCreate", msg => {
  
  if(msg.author.bot)
    return

})

// Handle all bot functions invoked via slash commands here:
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);