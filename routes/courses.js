var express = require("express");
var router = express.Router();
var courseControllers = require("../controllers/courseController");
var classControllers = require("../controllers/classController");

router.get("/", courseControllers.getAllCourse); //courses
router.get("/search", courseControllers.getCourseByName); //search?courseName=...
router.get("/class/:classID", courseControllers.getUserCoursePage);
router.get("/class/:classID/notice", classControllers.getCourseNotice);
router.get("/class/:classID/talk", classControllers.getTalk);
router.get("/class/:classID/talk/:talkID", classControllers.showTalk);
router.get("/class/:classID/talk/:talkID/return", classControllers.getTalk);
router.get("/:courseNumber", courseControllers.getCourseInfo); //courses/courseNumber

router.post(
  "/class/:classID/notice/updateNotice",
  classControllers.updateNotice
);
router.post("/class/:classID/talk/updateTalk", classControllers.writeTalk);
router.post(
  "/class/:classID/talk/:talkID/updateComment",
  classControllers.addComment
);
//router.get('/courseGrade',courseControllers.getGrade);
//router.get('/courseGradeChange', courseControllers.gradeChange);

module.exports = router;
