const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
//const { clientId, guildId, token } = require('./config.json');
const token = process.env.token;

const commands = [];

const categoryFolders = fs.readdirSync("./commands").filter(file => file.endsWith('_commands'))
for (const category of categoryFolders){
  const commandFiles = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
	  const command = require(`./commands/${category}/${file}`);
	  commands.push(command.data.toJSON());
} }
const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);