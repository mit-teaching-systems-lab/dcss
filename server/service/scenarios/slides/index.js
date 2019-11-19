const { Router } = require('express');
const { validateRequestBody } = require('../../../util/requestValidation');

const slides = new Router();
const {
    getSlides,
    addSlide,
    orderSlides,
    updateSlide,
    setAllSlides,
    deleteSlide
} = require('./endpoints');

slides.get('/', getSlides);
slides.post('/', [validateRequestBody, setAllSlides]);
slides.put('/', [validateRequestBody, addSlide]);
slides.post('/order', [validateRequestBody, orderSlides]);
slides.post('/:slide_id', [validateRequestBody, updateSlide]);
slides.delete('/:slide_id', deleteSlide);

module.exports = slides;
