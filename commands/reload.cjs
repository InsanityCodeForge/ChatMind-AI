const fs = require('fs');


module.exports = {
  name: 'reload',
  description: 'Reloads all commands',
  execute(message, args) {
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      message.reply('You do not have permission to use this command!');
      return;
    }
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.cjs'));

    let reloadedCommands = [];

    for (const file of commandFiles) {
      delete require.cache[require.resolve(`../commands/${file}`)];
      try {
        const newCommand = require(`../commands/${file}`);
        message.client.commands.set(newCommand.name, newCommand);
        reloadedCommands.push(newCommand.name);
      } catch (error) {
        console.error(error);
        message.reply(`There was an error while reloading ${file}: ${error.message}`);
      }
    }

    message.reply(`Reloaded the following commands: ${reloadedCommands.join(', ')}`);
  },
};
