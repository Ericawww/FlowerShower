var express = require('express');
var router = express.Router();
var indexCourses = require('../models/statics/indexCourses');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index/index', { courses: indexCourses });
});

router.get('/login', function (req, res) {
  res.render('index/login');
});

router.get('/regist', function (req, res) {
  res.render('index/regist');
});

module.exports = router;
