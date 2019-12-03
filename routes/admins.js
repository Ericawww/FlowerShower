var express = require('express');
var router = express.Router();
var adminControllers = require('../controllers/adminController');

router.get('/', adminControllers.getUserManagerPage);
router.get('/course', adminControllers.getCourseManagerPage);
router.post('/getUsers', adminControllers.getUsers);
router.post('/importUsers', adminControllers.importUsers);
router.post('/deleteUsers', adminControllers.deleteUsers);
router.post('/updateUser', adminControllers.updateUser);
router.post('/getCourses', adminControllers.getCourses);
router.post('/importCourse', adminControllers.importCourse);
router.post('/deleteCourses', adminControllers.deleteCourses);
router.post('/updateCourse', adminControllers.updateCourse);

module.exports = router;