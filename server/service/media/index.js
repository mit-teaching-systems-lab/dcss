const { Router } = require('express');
const { uploadAudio, uploadImage, requestMedia } = require('./endpoints');

const router = Router();

router.post('/audio', uploadAudio);
router.post('/image', uploadImage);

router.get('/*', requestMedia);

module.exports = router;
