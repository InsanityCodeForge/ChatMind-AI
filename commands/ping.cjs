const { createCanvas } = require('canvas');

module.exports = {
  name: 'ping',
  description: 'Ping!',
  async execute(message, args) {
    try {
      // Create a canvas with the dimensions 200x50 pixels
      const canvas = createCanvas(200, 50);
      const ctx = canvas.getContext('2d');

      // Set the font and fill style
      ctx.font = '30px Arial';
      ctx.fillStyle = '#000';

      // Draw the text "Pong." in the center of the canvas
      const text = 'Pong.';
      const textMetrics = ctx.measureText(text);
      ctx.fillText(text, (canvas.width - textMetrics.width) / 2, (canvas.height / 2) + 10);

      // Convert the canvas to a buffer and send it as an attachment in the channel
      const buffer = canvas.toBuffer('image/png');

      // Send the buffer as a message attachment using Message#reply()
      await message.reply({ files: [buffer] });
    } catch (error) {
      console.error(error);
      await message.reply('An error occurred while executing this command.');
    }
  },
};
