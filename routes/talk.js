var express = require("express");
var router = express.Router();
var talkControllers = require("../controllers/talkController");

/* GET home page. */
router.get("/", talkControllers.getTalk);
router.post("/talkBoard", talkControllers.writeTalk);

module.exports = router;
