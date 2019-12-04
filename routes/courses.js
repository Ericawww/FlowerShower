var express = require("express");
var router = express.Router();
var courseControllers = require("../controllers/courseController");
var noticeControllers = require("../controllers/noticeController");
var talkControllers = require("../controllers/talkController");

router.get("/", courseControllers.getAllCourse); //courses

router.get("/search", courseControllers.getCourseByName); //search?courseName=...
router.get("/class/:id", courseControllers.getUserCoursePage);
router.get("/class/:id/notice", noticeControllers.getCourseNotice);
router.get("/class/:id/talk", talkControllers.getTalk);
router.get("/:courseNumber", courseControllers.getCourseInfo); //courses/courseNumber

//router.get('/courseGrade',courseControllers.getGrade);
//router.get('/courseGradeChange', courseControllers.gradeChange);

module.exports = router;
