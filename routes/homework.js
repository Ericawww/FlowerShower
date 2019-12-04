var express = require("express");
var router = express.Router();
var homeworkControllers = require('../controllers/homeworkController');

router.get('/studentHomeworkListPage', (req, res) => { res.render('homework/studentHomeworkListPage'); });
router.get('/teacherHomeworkListPage', (req, res) => { res.render('homework/teacherHomeworkListPage'); });
router.get('/studentHomeworkDetail', (req, res) => { res.render('homework/studentHomeworkDetail'); });
router.get('/teacherHomeworkDetail', (req, res) => { res.render('homework/teacherHomeworkDetail'); });
router.get('/studentHomeworkSituation', (req, res) => { res.render('homework/studentHomeworkSituation'); });
router.get('/studentHomeworkComplain', (req, res) => { res.render('homework/studentHomeworkComplain'); });
router.get('/studentHomeworkSubmit', (req, res) => { res.render('homework/studentHomeworkSubmit'); });
router.get('/teacherHomeworkAdd', (req, res) => { res.render('homework/teacherHomeworkAdd'); });
router.post('/complainBoard', homeworkControllers.writeComplainBoard);

module.exports = router;