var express = require('express');
var router = express.Router();
var userControllers = require('../controllers/userController');

/* GET users listing. */
router.get('/', userControllers.userIndex);
router.post('/uploadImage', userControllers.userChangeImage);
router.post('/updateUserInfo', userControllers.updateUserInfo);

module.exports = router;
