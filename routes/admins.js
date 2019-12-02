var express = require('express');
var router = express.Router();
var adminControllers = require('../controllers/adminController');

router.get('/', adminControllers.getUserManagerPage);
router.post('/getUsers', adminControllers.getUsers);
router.post('/importUsers', adminControllers.importUsers);
router.post('/deleteUsers', adminControllers.deleteUsers);
router.post('/updateUser', adminControllers.updateUser);

module.exports = router;