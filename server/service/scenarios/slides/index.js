const { Router } = require('express');
const { validateRequestBody } = require('../../../util/requestValidation');
const { requireUserRole } = require('../../roles/middleware');

const requiredRoles = ['super_admin', 'admin', 'researcher', 'facilitator'];
const slides = new Router();
const {
    getSlides,
    getSlidesPromptComponents,
    addSlide,
    orderSlides,
    updateSlide,
    setAllSlides,
    deleteSlide
} = require('./endpoints');

slides.get('/', getSlides);
slides.post('/', [
    requireUserRole(requiredRoles),
    validateRequestBody,
    setAllSlides
]);
slides.get('/response-components', getSlidesPromptComponents);
slides.put('/', [
    requireUserRole(requiredRoles),
    validateRequestBody,
    addSlide
]);
slides.post('/order', [
    requireUserRole(requiredRoles),
    validateRequestBody,
    orderSlides
]);
slides.post('/:slide_id', [
    requireUserRole(requiredRoles),
    validateRequestBody,
    updateSlide
]);
slides.delete('/:slide_id', [requireUserRole(requiredRoles), deleteSlide]);

module.exports = slides;
