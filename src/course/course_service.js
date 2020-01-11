const Joi = require("@hapi/joi");
const ErrorHandler = require('../errors/ErrorHandler');
const validateObjectId = require('../helper/validateObjectId');
const {
    CourseModel
} = require('./course_model')
const {
    UserModel
} = require('../user/users_model')

// validate create course
async function validateCreateCourse(body) {

    const validateCourseSchema = Joi.object().keys({
        name: Joi.string().required().min(2).max(25),
        details: Joi.string().required().min(5).max(100)
    }).unknown();

    const {
        value,
        error
    } = validateCourseSchema.validate(body, {
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

    if (await CourseModel.countDocuments({
            name: body.name
        }) > 0)
        throw new ErrorHandler(400, {
            message: "name already exist in courses"
        })

    return undefined;

}
// validate edit course
async function validateEditCourse(body, courseId) {

    const validateCourseSchema = Joi.object().keys({
        name: Joi.string().required().min(2).max(25),
        details: Joi.string().required().min(5).max(100)
    }).unknown();

    const {
        value,
        error
    } = validateCourseSchema.validate(body, {
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

    if (await CourseModel.countDocuments({
            name: body.name
        }).where('_id').ne(courseId) > 0)
        throw new ErrorHandler(400, {
            message: "name already exist in courses"
        })

    return undefined;

}

async function createCourse(body, userId) {
    const {
        name,
        details
    } = body;
    const course = new CourseModel({
        name,
        details
    })
    course.createdById = userId;
    course.createdOn = new Date().setHours(new Date().getHours() + new Date().getTimezoneOffset() / -60);
    await course.save()

}

async function editCourse(body, courseId, userId) {
    const {
        name,
        details
    } = body;
    const course = await CourseModel.findOneAndUpdate({
        _id: courseId,
        createdById: userId
    }, {
        name: name,
        details: details
    }, {
        new: true
    })

    if (!course)
        throw new ErrorHandler(404, {
            message: "The course with thie given id not found ."
        })

    return undefined

}


// retrieve all  courses
async function getAllCourses(userId) {

    return await CourseModel.find({
        createdById: userId
    });

}

// retrieve course by id
async function getcourseById(courseId, userId) {

    return await CourseModel.findOne({
        _id: courseId,
        createdById: userId
    });

}

// delete course by id
async function deleteCourseById(courseId, userId) {

    return await CourseModel.deleteOne({
        _id: courseId,
        createdById: userId
    });

}

module.exports.validateCreateCourse = validateCreateCourse;
module.exports.createCourse = createCourse;

module.exports.validateEditCourse = validateEditCourse;
module.exports.editCourse = editCourse;
module.exports.getAllCourses = getAllCourses;
module.exports.getcourseById = getcourseById;
module.exports.deleteCourseById = deleteCourseById;