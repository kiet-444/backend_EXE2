// const dotenv = require('dotenv');
// dotenv.config();

// const { OpenAI } = require('openai');


// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY, 
// });

// const askGPT3_5 = async (prompt) => {
//     try {
//         const response = await openai.chat.completions.create({
//             model: 'gpt-3.5-turbo', 
//             messages: [ { role: 'system', content: 'You are a helpful assistant for a pet shop and adoption service.'},
//                 { role: 'user', content: prompt }], 
//             max_tokens: 100,
//             temperature: 0.7, 
//         });

//         return response.choices[0].message.content.trim(); 
//     } catch (error) {
//         console.error('Error communicating with OpenAI:', error.message);
//         throw new Error('Failed to fetch response from OpenAI.');
//     }
// };

// module.exports = { askGPT3_5 };
