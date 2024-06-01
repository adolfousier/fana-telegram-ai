const axios = require('axios');
require('dotenv').config();  // Load environment variables from a .env file
const TelegramBot = require('node-telegram-bot-api');

// Telegram bot token (replace it with your own token)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// API URL
const API_URL = process.env.API_URL;

// Function to make the query
async function query(data) {
    console.log('Starting query function...');
    console.log('Data to send:', data);
    try {
        const response = await axios.post(API_URL, data, {
            headers: {
                Authorization: `Bearer ${process.env.API_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('Response received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in the query:', error.message);
        console.error('Error details:', error);
        throw error;
    }
}

// Function to handle Telegram messages
async function handleTelegramMessage(message) {
    const chatId = message.chat.id;
    const text = message.text;

    console.log(`Handling message from chatId ${chatId}: ${text}`);

    try {
        // Log for incoming message
        console.log(`Incoming message: ${text}`);

        // Make the query with the user's message
        console.log('Calling query function...');
        const result = await query({ question: text });

        // Extract the text from the JSON response
        const responseText = result.text || 'Could not retrieve response text';

        // Log for outgoing message
        console.log(`Response: ${responseText}`);

        // Send the response to the Telegram chat
        const sendMessageUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        console.log(`Sending message to ${sendMessageUrl}`);
        await axios.post(sendMessageUrl, {
            chat_id: chatId,
            text: responseText,
        });
        console.log('Message sent successfully.');
    } catch (error) {
        // Handle errors
        console.error('Error handling Telegram message:', error.message);
        console.error('Error details:', error);
    }
}

// Configure the Telegram bot
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
console.log('Telegram bot configured with polling.');

// Handle Telegram messages
bot.on('message', handleTelegramMessage);

// Port to listen on (uses the port defined by the PORT environment variable or defaults to port 3000)
const port = process.env.PORT || 3000;

// Startup message
console.log(`Telegram bot started. Listening on port ${port}...`);

