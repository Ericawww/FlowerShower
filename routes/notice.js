var express = require("express");
var router = express.Router();
var noticeControllers = require("../controllers/noticeController");

/* GET notice page. */
router.get("/", noticeControllers.getCourseNotice);
router.get("/noticePage", (req, res) => {
  res.render("class/Course");
});

module.exports = router;
