# Real-time Fast AI Voice assistant
## Features
- AI Voice Assistant makes use of Groq API(AI models), deepgram api(STT) and playHT/neets API (TTS)
- The voice assistance that actually listens to you when you speak or interrupt the assistant.
- Uses LLama 3 70b/8b or gemma 7b AI models.
- Has memory of your past conversations.
- You can stop the assistant by saying "Disconnect".
  
  ## Installation
  ### Star and Clone this repository
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
  
