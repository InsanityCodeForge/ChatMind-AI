module.exports = {
    name: 'shutdown',
    description: 'Shuts down the bot (for authorized users only)',
    execute(interaction) {
      // Check if the user is authorized to shut down the bot
      if (interaction.user.id !== 'yourid') {
        return interaction.reply('You are not authorized to use this command.');
      }
  
      // Send a confirmation message
      interaction.reply('Shutting down good bye...');
  
            // Take the bot offline on Discord
            interaction.client.destroy();

      // Gracefully shut down the bot
      setTimeout(() => {
        process.exit();
      }, 1000);
  

    },
  };
  