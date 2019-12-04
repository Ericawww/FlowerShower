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
router.get('/teacherHomeworkUpdate', (req, res) => { res.render('homework/teacherHomeworkUpdate'); });
router.get('/teacherHomeworkSubmitSituation', (req, res) => { res.render('homework/teacherHomeworkSubmitSituation'); });
router.get('/teacherHomeworkGradeSituation', (req, res) => { res.render('homework/teacherHomeworkGradeSituation'); });
router.get('/teacherHomeworkDealComplain', (req, res) => { res.render('homework/teacherHomeworkDealComplain'); });
router.post('/complainBoard', homeworkControllers.writeComplainBoard);

module.exports = router;