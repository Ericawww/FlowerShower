var express = require('express');
var router = express.Router();
var courseControllers = require('../controllers/courseController');


// router.get('/:courseID', courseControllers.getUserCoursePage);
router.get('/',courseControllers.getGrade);

module.exports = router;