var express = require('express');
var router = express.Router();
var courseControllers = require('../controllers/courseController');


router.get('/', courseControllers.getAllCourse);
router.get('/class/:courseNumber', courseControllers.getUserCoursePage);


router.get('/search/:courseName', courseControllers.getCourseByName);

router.get('/:courseNumber', courseControllers.getCourseInfo);

module.exports = router;