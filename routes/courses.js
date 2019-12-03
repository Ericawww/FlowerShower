var express = require("express");
var router = express.Router();
var courseControllers = require("../controllers/courseController");
var noticeControllers = require("../controllers/noticeController");

//router.get("/:courseID", courseControllers.getUserCoursePage);

router.get("/notice", noticeControllers.getCourseNotice);

module.exports = router;
