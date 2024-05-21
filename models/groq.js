const Groq = require("groq-sdk");
const dotenv = require("dotenv");
dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function getGroqChat(text, stack) {
    console.log('groq: request recieved');
    console.time('groq_api')
    stack.push(
        {
            role: 'user',
            content: text
        }
    )
    const res = await groq.chat.completions.create({
        messages: stack,
        model: "llama3-70b-8192",
        stream: false
    });
    stack.push(
        {
            role: 'assistant',
            content: res.choices[0].message.content
        }
    )
    console.timeEnd('groq_api')
    return Promise.resolve(res.choices[0].message.content)
}

module.exports = {
    getGroqChat,
};