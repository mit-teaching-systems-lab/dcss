const FileType = require('file-type');
const Multer = require('multer');
const uuid = require('uuid/v4');

const db = require('./db');
const { asyncMiddleware } = require('../../util/api');
const { uploadToS3, requestFromS3 } = require('./s3');
const { requestTranscriptionAsync } = require('./transcript');

async function uploadAudioAsync(req, res) {
  const storage = Multer.memoryStorage();
  const upload = Multer({ storage });

  upload.single('recording')(req, res, async err => {
    if (err) {
      return res
        .status(400)
        .json({ message: 'Upload Request Validation Failed' });
    } else if (!req.body.name) {
      return res
        .status(400)
        .json({ message: 'No recording name in request body' });
    }

    const buffer = req.file.buffer;
    const { runId, responseId } = req.body;
    const userId = req.session.user.id;
    const key = `audio/${runId}/${responseId}/${userId}/${uuid()}.mp3`;

    try {
      const s3Location = await uploadToS3(key, buffer);
      res.status = 200;
      res.send({
        s3Location
      });
    } catch (error) {
      res.status = 200;
      res.send({
        error,
        s3Location: key
      });
    }

    const { response, transcript } = await requestTranscriptionAsync(buffer);

    db.addAudioTranscript({ key, response, transcript });
  });
}

async function uploadImageAsync(req, res) {
  const storage = Multer.memoryStorage();
  const upload = Multer({ storage });

  upload.single('file-0')(req, res, async error => {
    if (error) {
      return res
        .status(400)
        .json({ message: 'Upload Request Validation Failed' });
    }

    const {
      buffer,
      // originalname,
      size
    } = req.file;

    const { ext } = await FileType.fromBuffer(buffer);
    const name = `${uuid()}.${ext}`;
    const key = `image/${req.session.user.id}/${name}`;

    try {
      const s3Location = await uploadToS3(key, buffer);
      const url = `/api/media/${s3Location}`;
      res.status = 200;
      res.send({
        result: [{
          name,
          size,
          url
        }]
      });

    } catch (error) {
      res.status = 200;
      res.send({
        error,
        s3Location: key
      });
    }
  });
}

async function requestMediaAsync(req, res, next) {
  return requestFromS3(req, res, next);
}

exports.uploadAudio = asyncMiddleware(uploadAudioAsync);
exports.uploadImage = asyncMiddleware(uploadImageAsync);
exports.requestMedia = asyncMiddleware(requestMediaAsync);
