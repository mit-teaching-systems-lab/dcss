const { Router } = require('express');
const cors = require('cors');

const rolesRouter = Router();

rolesRouter.get('/roles/:user', (req, res) => {
    const user = req.params.user;
    res.json({user});
});

module.exports = rolesRouter;