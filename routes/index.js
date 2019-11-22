var express = require('express');
var router = express.Router();
var userControllers = require('../controllers/userController');

/* GET home page. */
router.get('/', userControllers.index);
router.get('/login', (req, res) => { res.render('index/login'); });
router.get('/logout', userControllers.userLogout);
router.get('/regist', (req, res) => { res.render('index/regist'); });
router.get('/regist/captcha', userControllers.getCaptcha);
router.post('/login', userControllers.userVerify);
router.post('/regist', userControllers.userRegist);

module.exports = router;
