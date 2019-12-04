var express = require("express");
var router = express.Router();
var courseControllers = require("../controllers/courseController");
var classControllers = require("../controllers/classController");

router.get("/", courseControllers.getAllCourse); //courses
router.get("/search", courseControllers.getCourseByName); //search?courseName=...
router.get("/class/:classID", courseControllers.getUserCoursePage);
router.get(
  "/class/:classID/notice/updateNotice",
  classControllers.updateNotice
);
router.get("/class/:classID/notice", classControllers.getCourseNotice);
router.get("/class/:classID/talk", classControllers.getTalk);
router.get("/:courseNumber", courseControllers.getCourseInfo); //courses/courseNumber

//router.get('/courseGrade',courseControllers.getGrade);
//router.get('/courseGradeChange', courseControllers.gradeChange);

module.exports = router;
