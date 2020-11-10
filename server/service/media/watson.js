const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

exports.requestTranscriptionAsync = async buffer => {
  const authenticator = new IamAuthenticator({ apikey: process.env.WATSON_SPEECHTOTEXT_KEY });
  const url = process.env.WATSON_SPEECHTOTEXT_URL;
  const service = new SpeechToTextV1({ authenticator, url });
  const { result: response, status } = await service.recognize({
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

exports.requestRecognitionAsync = async buffer => {
  if (process.env.WATSON_VISREC_URL && process.env.WATSON_VISREC_KEY) {
    const authenticator = new IamAuthenticator({
      apikey: process.env.WATSON_VISREC_KEY
    });
    const url = process.env.WATSON_VISREC_URL;
    const version = '2018-03-19';
    const service = new VisualRecognitionV3({ authenticator, url, version });
    const {
      result: { images },
      status
    } = await service.classify({
      imagesFile: buffer
    });

    const { classifiers } = images.length && images[0];

    if (status === 200) {
      return classifiers.reduce((accum, classifier) => {
        if (classifier.name === 'default') {
          return classifier.classes;
        }
        return accum;
      }, []);
    }
  } else {
    return null;
  }
};
