var express = require('express');
var router = express.Router();
var indexCourses = require('../models/statics/indexCourses');
var userControllers = require('../controllers/userController');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index/index', { courses: indexCourses });
});

router.get('/login', (req, res) => {
  res.render('index/login');
});

router.get('/regist', (req, res) => {
  res.render('index/regist');
});

router.post('/login', userControllers.userVerify);

module.exports = router;
