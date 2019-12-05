var express = require('express');
var router = express.Router();
var courseControllers = require('../controllers/courseController');

router.get('/classes/:classID/teacher/courseGrade', courseControllers.getGrade);

router.get('/classes/:classID/teacher/:classid/courseGradeChange', courseControllers.gradeChange);
// router.get('/courseGrade',courseControllers.getGrade);

router.post('/gradeChange', courseControllers.setGradeChange);
router.get('/', courseControllers.getAllCourse);//courses

router.get('/search', courseControllers.getCourseByName);//search?courseName=...
router.get('/class/:id',courseControllers.getUserCoursePage);
router.get('/class/:id/notice');
router.get('/class/:id/talk');
router.get('/:courseNumber', courseControllers.getCourseInfo);//courses/courseNumber





module.exports = router;