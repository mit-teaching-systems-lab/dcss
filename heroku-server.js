const express = require('express');
const path = require('path');
const enforce = require('express-sslify');

const { listener } = require('./server');

listener.use(enforce.HTTPS({ trustProtoHeader: true }));
listener.use(express.static('./dist'));

listener.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});
