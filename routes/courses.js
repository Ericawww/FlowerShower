var express = require('express');
var router = express.Router();
var courseControllers = require('../controllers/courseController');


router.get('/coursePage', courseControllers.getUserCoursePage);
router.get('/courseGrade',courseControllers.getGrade);
router.get('/courseGradeChange',courseControllers.gradeChange);

module.exports = router;