const { Router } = require('express');
const cors = require('cors');

const rolesRouter = Router();

rolesRouter.get('/roles', (req, res) => {
    res.send('test');
});

module.exports = rolesRouter;