var express = require("express");
var router = express.Router();
var courseControllers = require("../controllers/courseController");
var classController = require("../controllers/classController");

router.get("/", courseControllers.getAllCourse); //courses
router.get("/search", courseControllers.getCourseByName); //search?courseName=...
router.get("/class/:classID", courseControllers.getUserCoursePage);
router.get("/class/:classID/notice", classController.getCourseNotice);
router.get("/class/:classID/talk", classController.getTalk);
router.get("/class/:classID/talk/:talkID", classController.showTalk);
router.get("/class/:classID/talk/:talkID/return", classController.getTalk);
router.get("/:courseNumber", courseControllers.getCourseInfo); //courses/courseNumber

router.post(
  "/class/:classID/notice/updateNotice",
  classController.updateNotice
);
router.post("/class/:classID/talk/updateTalk", classController.writeTalk);
router.post(
  "/class/:classID/talk/:talkID/updateComment",
  classController.addComment
);
//router.get('/courseGrade',courseControllers.getGrade);
//router.get('/courseGradeChange', courseControllers.gradeChange);

module.exports = router;
