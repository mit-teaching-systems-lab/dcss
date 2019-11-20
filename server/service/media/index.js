const { Router } = require('express');
const { uploadAudio } = require('./endpoints');

const mediaRouter = Router();

mediaRouter.post('/audio', uploadAudio);

module.exports = mediaRouter;
