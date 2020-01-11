const router = require('express').Router();
const courseService = require('./course_service');

// create Course
router.post('/', async (req, res, next) => {
    try {

        await courseService.validateCreateCourse(req.body);

        await courseService.createCourse(req.body, req.user._id);

        return res.status(201).send({
            message: 'course created successfully'
        });
    } catch (e) {
        return next(e)
    }
});

// update course
router.put('/:id', async (req, res, next) => {
    try {

        await courseService.validateEditCourse(req.body, req.params.id);

        await courseService.editCourse(req.body, req.params.id, req.user._id);

        return res.status(200).send({
            message: 'course updated successfully'
        });
    } catch (e) {
        return next(e)
    }
});

// retrieve all  courses
router.get('/', async (req, res, next) => {
    try {

        const courses = await courseService.getAllCourses(req.user._id);

        return res.status(200).send(courses);
    } catch (e) {
        return next(e)
    }
});

// retrieve course by id
router.get('/:id', async (req, res, next) => {
    try {

        const courses = await courseService.getcourseById(req.params.id, req.user._id);

        return res.status(200).send(courses);
    } catch (e) {
        return next(e)
    }
});

// delete course by id
router.delete('/:id', async (req, res, next) => {
    try {

        const courses = await courseService.deleteCourseById(req.params.id, req.user._id);

        return res.status(200).send(courses);
    } catch (e) {
        return next(e)
    }
});
module.exports = router;