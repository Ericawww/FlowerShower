var express = require("express");
var router = express.Router();
var classController = require('../controllers/classController');
//验证身份
router.all('/student/',classController.checkStudent)// courses/classes/:classID/student  ->匹配学生，验证身份，next
router.all('/teacher/',classController.checkTeacher)//判断身份，用next()

//主页
router.get('/student/main', classController.getStuMainPage);// courses/classes/:classID/student/main ->课程主页面
router.get('/teacher/main',classController.getTcMainPage);

//作业
router.get('/student/hw/:hw', classController.checkHw);//courses/classes/:classID/student/hw/:hw ->学生作业，验证作业，next
router.get('/student/hw/all', classController.getStuAllHw);// courses/classes/:classID/student/hw/:hw/all ->作业列表
router.get('/student/hw/:hw/detail', classController.getStuHwDetail);// courses/classes/:classID/student/hw/:hw/detail ->作业详情
router.get('/student/hw/:hw/situation',classController.getStuHwSituation);// courses/classes/:classID/student/hw/:hw/situation ->提交和批改情况
router.get('/student/hw/:hw/complain',classController.getStuHwComplain);// courses/classes/:classID/student/hw/:hw/complain ->申诉
router.get('/student/hw/:hw/submit',classController.getStuHwSubmit);// courses/classes/:classID/student/hw/:hw/submit ->提交作业

router.get('/teacher/hw/:hw', classController.checkHw);
router.get('/teacher/hw/all', classController.getTcAllHw);
router.get('/teacher/hw/:hw', classController.getTcHwDetail);
router.get('/teacher/hw/add', classController.addHw);

//申诉？
router.post('/complainBoard', homeworkControllers.writeComplainBoard);//待定

module.exports = router;