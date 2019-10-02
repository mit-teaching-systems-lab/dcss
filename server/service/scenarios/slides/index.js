const { Router } = require('express');
const { validateRequestBody } = require('../../../util/requestValidation');

const slides = new Router();
const {
    getSlides,
    addSlide,
    orderSlides,
    updateSlide
} = require('./endpoints');

slides.get('/', getSlides);
slides.put('/', [validateRequestBody, addSlide]);
slides.post('/order', [validateRequestBody, orderSlides]);
slides.post('/:slide_id', [validateRequestBody, updateSlide]);

module.exports = slides;
