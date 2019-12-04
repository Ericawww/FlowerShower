var express = require('express');
var router = express.Router();
var courseControllers = require('../controllers/courseController');


router.get('/', courseControllers.getCourseInfo);
//courses?courseNumber=..
router.get('/class/:courseNumber', courseControllers.getUserCoursePage);
//all
router.get('/search', courseControllers.getAllCourse);
//search/courseName
router.get('/search/:courseName', courseControllers.getCourseByName);


module.exports = router;