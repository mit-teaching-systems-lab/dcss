const { Router } = require('express');
const { uploadAudio, requestAudio } = require('./endpoints');

const router = Router();

router.post('/audio', uploadAudio);
router.get('/audio/*', requestAudio);

module.exports = router;
