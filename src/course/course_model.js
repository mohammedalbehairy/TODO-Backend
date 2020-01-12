const mongoose = require('mongoose');
const ObjectID = require('bson').ObjectID;

const { Schema } = mongoose;

const CoursesSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    details: {
        type: String,
        required: true
    },
    createdById: {
        type: ObjectID,
        required: true,
        ref: 'Users'
    },
    createdOn: {
        type: Date
    }
});


const CourseModel = mongoose.model('Courses', CoursesSchema);



exports.CourseModel = CourseModel;