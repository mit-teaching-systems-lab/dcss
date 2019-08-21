const express = require('express');
const path = require('path');

const app = express()
const port = process.env.SERVER_PORT || 5000;

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});

