const PlayHT = require('playht')
async function initialize(){
    console.log('playht: initializing')
    PlayHT.init({
        apiKey: process.env.PLAY_API_KEY,
        userId: process.env.PLAY_USERID,
    });
}
async function play(text) {

/* 
    function chunkText(text, maxChunkSize= 500) {
        const words = text.split(' ');
        const chunks = [];
        let currentChunk = '';
      
        for (const word of words) {
          if ((currentChunk + word).length <= maxChunkSize) {
            currentChunk += ' ' + word;
          } else {
            chunks.push(currentChunk.trim());
            currentChunk = word;
          }
        }
      
        if (currentChunk) {
          chunks.push(currentChunk.trim());
        }
      
        return chunks;
      }
*/   

    const streamingOptions = {
        // must use turbo for the best latency
        voiceEngine: "PlayHT2.0-turbo",
        //id: 'charlotte',
        // this voice id can be one of our prebuilt voices or your own voice clone id, refer to the`listVoices()` method for a list of supported voices.
        voiceId:
           "s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json",
        // you can pass any value between 8000 and 48000, 24000 is default
        sampleRate: 44100,
        // the generated audio encoding, supports 'raw' | 'mp3' | 'wav' | 'ogg' | 'flac' | 'mulaw'
        outputFormat: 'mp3',
        speed: 1,
    };
    return PlayHT.stream(text, streamingOptions);
}

module.exports = {
    play,
    initialize
}
