const axios = require('axios')

async function neets(text){
    return axios.post('https://api.neets.ai/v1/tts', {
        text: text,
        voice_id: 'us-female-4',
        params: {
            model: 'style-diff-500'
        },
    },
        {
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': process.env.NEETS_API
            },
            responseType: 'arraybuffer'
        }
    ).then((response) => {
        return  response.data
    })

}

module.exports = neets