const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { Pool } = require('pg');
const s3Router = require('./service/s3');

const app = express();
const port = process.env.SERVER_PORT || 5000;
const pgSession = require('connect-pg-simple')(session);

app.use(cors());

app.use(
    session({
        secret: 'mit tsl teacher moments',
        resave: false,
        saveUninitialized: true,
        store: new pgSession({
            pool: new Pool(),
            tableName: 'session'
        }),
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
    })
);

/**
 *  This is a stubbed endpoint for logging in.
 *  When a user hits this endpoint, the user 'boo'
 *  becomes the active session user.
 */
app.post('/login', cors(), (req, res) => {
    req.session.username = 'boo';
    res.send({ ok: true, username: req.session.username });
});

app.get('/me', (req, res) => {
    if (!req.session.username) res.send('Not logged in!');
    res.send({ username: req.session.username });
});

/**
 *  This is a stubbed endpoint for logging out.
 *  When a user hits this endpoint, the user 'boo'
 *  is no longer the active session user.
 */
app.post('/logout', (req, res) => {
    delete req.session.username;
    req.session.destroy(() => res.send('ok'));
});

app.use('/media', s3Router);

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});
