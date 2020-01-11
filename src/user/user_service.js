const Joi = require("@hapi/joi");
const ErrorHandler = require('../errors/ErrorHandler');
const { UserModel } = require('../user/users_model')

// create user functions
async function validateCreateUser(body) {

    const validateUserSchema = Joi.object().keys({
        email: Joi.string().required().email(),
        name: Joi.string().required().min(3).max(25),
        password: Joi.string().required().min(6).max(40)
    }).unknown();

    const { value, error } = validateUserSchema.validate(body, { abortEarly: false });
    if (error) {
        const messages = error.details.map(i => {
            let e = {};
            e[i.context.key] = i.message.replace(/\"/g, '');
            return e;
        })
        throw new ErrorHandler(400, messages)
    }
    if (await UserModel.countDocuments({ email: body.email }) > 0)
        throw new ErrorHandler(400, { message: "email already exist in users" })

    return undefined;

}

async function createUser(body) {
    const { email, name, password } = body;
    const user = new UserModel({ email, name });
    user.setPassword(password)
    await user.save()
}


module.exports.validateCreateUser = validateCreateUser;
module.exports.createUser = createUser;