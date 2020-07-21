const { Router } = require('express');
const { requireUser } = require('../auth/middleware');

const { uploadAudio, uploadImage, requestMedia } = require('./endpoints');

const router = Router();

router.post('/audio', uploadAudio);
router.post('/image', uploadImage);

router.get('/*', [requireUser, requestMedia]);

module.exports = router;
