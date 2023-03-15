import dotenv from "dotenv";
import { Client, ClientUser, GatewayIntentBits, Collection, IntentsBitField, } from "discord.js";
import { Configuration, OpenAIApi } from "openai";
import chalk from "chalk";
import ora from "ora";
import fs from "fs";
import path from "path";


dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.GuildMessageReactions,

  ],
  partials: ["CHANNEL", "MESSAGE", "REACTION"],
});

//console.log(chalk.bold.green("Welcome to the chat bot will dalle-2 support, lets get started the first thing you are going to want to do is setup your api keys in the .env file once you have finished that re run the command | node index"));

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));


// Create a collection to store the commands
client.commands = new Collection();

// Read the commands folder and import each command file
// Define a function to delete all existing commands
async function deleteAllCommands() {
    const commands = await client.application.commands.fetch();
    for (const command of commands.values()) {
      await command.delete();
      console.log(`Deleted ${command.name} command`);
    }
  }
  
  // Call the deleteAllCommands function before registering new commands
  client.once("ready", async () => {
    console.log(chalk.bold.green("Bot is ready!"));
  
    // Fetch the application
    //await client.fetchApplication();
  
    // Set the status of the bot
    client.user.setPresence({
      status: "online",
      activity: {
        name: "Discord.js",
        type: "PLAYING",
      },
    });
  
    // Delete all existing commands
    await deleteAllCommands();
  
    // Read the commands folder and import each command file
    const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.cjs'));

    for (const file of commandFiles) {
        const { default: command } = await import(`./commands/${file}`);

    if (!command) {
      console.log(chalk.bold.red(`Error loading command from ${file}`));
      continue;
    }

    client.commands.set(command.name, command);
    console.log(chalk.bold.green(`Loaded command: ${command.name}`));

    const { name, description, options } = command;

    const commandOptions = options
      ? options.map((option) => ({
          name: option.name,
          description: option.description,
          type: option.type,
          required: option.required,
          choices: option.choices,
        }))
      : [];

    client.application.commands
      .create({
        name,
        description,
        options: commandOptions,
      })
      .then(() => console.log(`Registered ${name} command`))
      .catch(console.error);
  }
});

  
// Modify the interaction handler to use the imported command
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
  
    const { commandName, options } = interaction;
    const command = client.commands.get(commandName);
  
    if (!command) return;
  
    try {
      await command.execute(interaction, options);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  });
  



client.on("messageCreate", async function (message) {
    if (message.author.bot) return;
    // if (message.content.startsWith !== "~") return;
    // if (message.content.startsWith !== "!") return;
    if (message.channel.id !== "discordchannelid") return false;
    
    try {
      const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
              {role: "system", content: "your starter descriptior of the bot."},
              {role: "user", content: message.content}
          ],
        });
  
      const content = response.data.choices[0].message;
      return message.reply(content);
  
    } catch (err) {
      return message.reply(
        "As an AI robot, I errored out."
      );
    }
  });





  client.login(process.env.BOT_TOKEN);
//   .then(async () => {
//     console.log('Bot is ready!');
//     await client.fetch();
//     client.application.commands.create({
//             name: command.name,
//             description: command.description,
//           })
//             .then(() => console.log(`Registered ${command.name} command`))
//             .catch(console.error);
//   });
