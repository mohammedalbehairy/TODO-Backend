const Joi = require("@hapi/joi");
const ErrorHandler = require('../errors/ErrorHandler');
const {
    UserModel
} = require('../user/users_model')

// login routes functions
async function validateUser(body) {
    const validateUserSchema = Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6).max(40)
    }).unknown();

    const {
        value,
        error
    } = validateUserSchema.validate(body, {
        abortEarly: false
    });

    if (error) {
        const messages = error.details.map(i => {
            let e = {};
            e[i.context.key] = i.message.replace(/\"/g, '');
            return e;
        })
        throw new ErrorHandler(400, messages)
    }
    let user = await UserModel.findOne({
        email: body.email
    })

    if (!user) throw new ErrorHandler(400, {
        message: "invalid user email or/and password"
    })

    user = new UserModel(user);

    if (!user.validatePassword(body.password)) throw new ErrorHandler(400, {
        message: "invalid user email or/and password"
    })

    return user;

}

async function login(user) {
    const token = user.generateJWT();
    return {
        bearer: token,
        email: user.email,
        name: user.name
    }
}

module.exports.validateUser = validateUser;
module.exports.login = login;