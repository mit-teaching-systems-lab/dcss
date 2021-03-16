const { Router } = require('express');
const { requireUserOrMediaRequestToken } = require('./middleware');
const { uploadAudio, uploadImage, requestMedia } = require('./endpoints');

const router = Router();

router.post('/audio', uploadAudio);
router.post('/image', uploadImage);

router.get('/*', [requireUserOrMediaRequestToken, requestMedia]);

module.exports = router;
