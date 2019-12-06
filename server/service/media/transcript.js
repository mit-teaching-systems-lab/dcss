const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const authenticator = new IamAuthenticator({ apikey: process.env.WATSON_KEY });
const url = process.env.WATSON_URL;

exports.requestTranscriptionAsync = async buffer => {
    const speechToText = new SpeechToTextV1({ authenticator, url });
    const { result: response, status } = await speechToText.recognize({
        audio: buffer,
        contentType: 'audio/mp3; rate=44100',
        wordAlternativesThreshold: 0.9
    });

    if (status !== 200) {
        return {
            response,
            transcript: ''
        };
    }

    const transcript = response.results.reduce(
        (accum, { alternatives }, index, source) =>
            accum.concat(
                `${alternatives[0].transcript}${
                    source.length > index + 1 ? ' [PAUSE] ' : ''
                }`
            ),
        ''
    );

    return {
        response,
        transcript
    };
};
