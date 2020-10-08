// eslint-disable-next-line no-unused-vars
const FileType = require('file-type');
const Multer = require('multer');
const uuid = require('uuid/v4');

const db = require('./db');
const {
  getLastResponseOrderedById,
  updateResponse
} = require('../runs/db');
const { asyncMiddleware } = require('../../util/api');
const { uploadToS3, requestFromS3 } = require('./s3');
const {
  requestRecognitionAsync,
  requestTranscriptionAsync
} = require('./watson');

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
    const { runId: run_id, responseId: response_id } = req.body;
    const user_id = req.session.user.id;
    const key = `audio/${run_id}/${response_id}/${user_id}/${uuid()}.mp3`;

    const id = await db.getAudioTranscriptByKey(
      `audio/${run_id}/${response_id}/${user_id}/`
    );

    if (id) {
      await db.setAudioTranscript(id, {
        replaced_at: new Date().toISOString()
      });
    }

    try {
      const s3Location = await uploadToS3(key, buffer);
      const identifiers = {
        run_id,
        response_id,
        user_id
      };

      // Check if a response has been saved. This may have occurred while
      // the upload to S3 was in progress.
      await updateResponseIfExists(s3Location, identifiers);

      // This could take a very long time
      const { response, transcript } = await requestTranscriptionAsync(buffer);

      await db.addAudioTranscript(key, response, transcript);

      // The previous call to updateResponseIfExists may have had nothing to do
      // at the time that it was called. Since the transcription process may
      // take a very long time, and during that time this response might be saved,
      // (ie. before this operation has responded to the client), so we must
      // check again to ensure that the response receives the s3Location value.
      await updateResponseIfExists(s3Location, identifiers);

      res.status = 200;
      res.send({
        s3Location,
        transcript
      });
    } catch (error) {
      res.status = 200;
      res.send({
        error
      });
    }
  });
}

async function updateResponseIfExists(value, identifiers) {
  const previous = await getLastResponseOrderedById(identifiers);

  if (previous && !previous.response.value) {
    const response = {
      ...previous.response,
      value
    };
    await updateResponse(previous.id, { response });
  }
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
    const user_id = req.session.user.id;
    const { buffer, originalname, size } = req.file;

    // const { ext } = await FileType.fromBuffer(buffer);
    // const name = `${uuid()}.${ext}`;
    // const key = `image/${req.session.user.id}/${name}`;
    const name = `${uuid()}-${originalname}`;
    const key = `image/${req.session.user.id}/${name}`;

    try {
      const s3Location = await uploadToS3(key, buffer);
      const url = `/api/media/${s3Location}`;
      const image = await db.addImage({ name, size, url, user_id });

      res.status = 201;
      res.send({
        result: [
          {
            name,
            size,
            url
          }
        ]
      });

      try {
        const classes = await requestRecognitionAsync(buffer);
        if (classes) {
          db.addImageRecognition({ ...image, classes });
        }
      } catch (error) {
        res.status = 500;
        res.send({
          error
        });
      }
    } catch (error) {
      res.status = 500;
      res.send({
        error
      });
    }
  });
}

async function getImageGallery(req, res) {
  const images = await db.getImagesByUserId(req.session.user.id);
  const result = images.map(image => {
    const { url: src, classes } = image;
    const stringifiedClasses =
      classes &&
      classes
        .map(c => c.class)
        .join(', ')
        .trim();
    const classification = classes ? stringifiedClasses : '';

    return {
      src,
      name: classification,
      alt: classification,
      tag: classification
    };
  });

  res.status = 200;
  res.send({ result });
}

async function requestMediaAsync(req, res, next) {
  if (req.url.includes('gallery/images')) {
    return getImageGallery(req, res, next);
  }
  return requestFromS3(req, res, next);
}

exports.uploadAudio = asyncMiddleware(uploadAudioAsync);
exports.uploadImage = asyncMiddleware(uploadImageAsync);
exports.requestMedia = asyncMiddleware(requestMediaAsync);
