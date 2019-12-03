var express = require("express");
var router = express.Router();
var noticeController = require("../controllers/noticeController");

/* GET notice page. */
router.get("/", noticeController.getCourseNotice);

module.exports = router;
