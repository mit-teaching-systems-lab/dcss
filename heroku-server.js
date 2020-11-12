const express = require('express');
const path = require('path');
const enforce = require('express-sslify');

const { apiServer: server } = require('./server');

server.use(enforce.HTTPS({ trustProtoHeader: true }));
server.use(express.static('./dist'));
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
