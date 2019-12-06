const multer = require('multer');
const uuid = require('uuid/v4');

const db = require('./db');
const { asyncMiddleware } = require('../../util/api');
const { uploadToS3, requestFromS3 } = require('./s3');
const { requestTranscriptionAsync } = require('./transcript');

async function uploadAudio(req, res) {
    const storage = multer.memoryStorage();
    const upload = multer({ storage });

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

        const s3Location = await uploadToS3(key, buffer);

        res.status = 200;
        res.send({
            s3Location
        });

        const { response, transcript } = await requestTranscriptionAsync(
            buffer
        );

        db.addAudioTranscript({ key, response, transcript });
    });
}

async function requestAudio(req, res, next) {
    return requestFromS3(req, res, next);
}

exports.uploadAudio = asyncMiddleware(uploadAudio);
exports.requestAudio = asyncMiddleware(requestAudio);
