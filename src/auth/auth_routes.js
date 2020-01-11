const router = require('express').Router();
const authService = require('./auth_service');

router.post('/login', async (req, res, next) => {
    try {
        console.log(req.body);
        
        const user = await authService.validateUser(req.body);

        const authJosn = await authService.login(user);
        
        return res.status(200).send(authJosn);
    } catch (e) {
        return next(e)
    }
});

module.exports = router;