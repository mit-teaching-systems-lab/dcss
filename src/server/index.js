const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const pgSession = require('connect-pg-simple')(session);

const authRouter = require('./service/authentication');
const rolesRouter = require('./service/roles');
const s3Router = require('./service/s3');

const app = express();
const port = process.env.SERVER_PORT || 5000;

app.use(bodyParser.json());
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

app.use('/auth', authRouter);
app.use('/roles', rolesRouter);
app.use('/media', s3Router);

const listener = express();
listener.use('/api', app);
listener.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on ${port}`);
});
