const router = require('express').Router();
const userervice = require('./user_service');

// create user
router.post('/', async (req, res, next) => {
    try {
        await userervice.validateCreateUser(req.body);

        await userervice.createUser(req.body);

        return res.status(201).send({ message: 'user created successfully' });
    } catch (e) {
        return next(e)
    }
});


module.exports = router;