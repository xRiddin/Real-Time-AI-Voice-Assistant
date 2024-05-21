# Real-time Fast AI Voice assistant
## Features
- Fast AI Voice Assistant, takes <1 second to reply back to you.
- Built using Node.js and Websockets.
- AI Voice Assistant makes use of Groq API(AI models), deepgram api(STT) and playHT/neets API (TTS)
- The voice assistance that actually listens to you when you speak or interrupt the assistant.
- Uses LLama 3 70b/8b or gemma 7b AI models.
- Has memory of your past conversations.
- You can stop the assistant by saying "Disconnect".
  
  ## Installation
  ### Clone this repository
  ```git clone https://github.com/xriddin/real-time-AI-voice-assistant.git```
  ### install the dependencies:
  ```npm i```
  ### Set up the API keys in .env file:
  - GROQ_API https://console.groq.com/keys
  - playht_api and playht_userId https://play.ht
  - deepgram_api https://console.deepgram.com
  - neets_api https://neets.ai/studio

  ### Start the Assistant
  ``` npm run start ```
  ### Contributing
  If you encounter bugs or have feature requests, please create an issue on GitHub. Pull requests are also appreciated. Don't forget to star this project if you find it useful!
  
  ### Thanks to the following projects:
- [Groq API](https://groq.com)
- [Deepgram API](https://deepgram.com)
- [PlayHT API](https://play.ht)
- [Neets API](https://neets.ai/studio)
