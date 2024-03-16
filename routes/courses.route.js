const express = require('express');

const router = express.Router();

const coursesController = require('../controllers/courses.controller.js');
const validationSchema = require('../middleware/validationSchema.js');
const verifyToken = require('../middleware/verifyToken.js');
const userRoles = require('../utils/userRoles.js');
const allowedTo = require('../middleware/allowedTo.js');

router.route('/')
            .get(coursesController.getAllCourses)
            .post(verifyToken, allowedTo(userRoles.MANAGER), validationSchema(), coursesController.addCourse);


router.route('/:courseId')
            .get(coursesController.getCourse)
            .patch(coursesController.updateCourse)
            .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANAGER), coursesController.deleteCourse);

module.exports = router;