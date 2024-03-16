let Course = require('../models/course.model.js');
const { validationResult } = require('express-validator');
const httpStatusText = require('../utils/httpStatusText.js');
const asyncWrapper = require('../middleware/asyncWrapper.js');
const appError = require('../utils/appError.js');

const getAllCourses = asyncWrapper(async (req,res) => {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    const courses = await Course.find({}, {"__v": false}).limit(limit).skip(skip);

    res.json({status: httpStatusText.SUCCESS, data: {courses}});
})

const getCourse = asyncWrapper(async (req, res, next) => {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
        const err = appError.create("course not found", 404, httpStatusText.FAIL);
        next(err);
    }
    res.json({status: httpStatusText.SUCCESS, data: {course}});
})

const addCourse = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = appError.create(errors.array(), 400, httpStatusText.FAIL);
        next(err);
    }

    const newCourse = new Course(req.body);

    await newCourse.save();

    res.status(201).json({status: httpStatusText.SUCCESS, data: {course: newCourse}});
})

const updateCourse = asyncWrapper(async (req,res) => {
    const courseId = req.params.courseId;

    const updatedCourse = await Course.updateOne({_id: courseId}, {$set: {...req.body}});

    res.status(200).json({status: httpStatusText.SUCCESS, data: {course: updatedCourse}});
})

const deleteCourse = asyncWrapper(async (req,res) => {
    const courseId = req.params.courseId;

    await Course.deleteOne({_id: courseId});

    res.status(200).json({status: httpStatusText.SUCCESS, data: null});
})

module.exports = {
    getAllCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
}