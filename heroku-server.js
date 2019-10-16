const express = require('express');
const { listener, app } = require('./server');

listener.use(express.static('./dist'));
