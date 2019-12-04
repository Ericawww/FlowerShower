var express = require("express");
var router = express.Router();
var courseControllers = require("../controllers/courseController");
var noticeControllers = require("../controllers/noticeController");
var talkControllers = require("../controllers/talkController");

router.get("/", courseControllers.getAllCourse); //courses

router.get("/search", courseControllers.getCourseByName); //search?courseName=...
router.get("/class/:classID", courseControllers.getUserCoursePage);
router.get("/class/:classID/notice", noticeControllers.getCourseNotice);
router.get("/class/:classID/talk", talkControllers.getTalk);

router.get("/:courseNumber", courseControllers.getCourseInfo); //courses/courseNumber

module.exports = router;
