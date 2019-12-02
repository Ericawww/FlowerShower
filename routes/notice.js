var express = require("express");
var router = express.Router();
var noticeController = require("../controllers/noticeController");

/* GET notice page. */
router.get("/", noticeController.getCourseNotice);
router.get("/noticePage", (req, res) => {
  res.render("class/Course");
});

module.exports = router;
