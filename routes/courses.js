var express = require("express");
var router = express.Router();
var courseControllers = require("../controllers/courseController");
var classController = require("../controllers/classController");
var homeworkController = require('../controllers/homeworkController');

router.get("/", courseControllers.getAllCourse); //courses
router.get("/search", courseControllers.getCourseByName); //search?courseName=...
router.get("/class/:classID", courseControllers.getUserCoursePage);
router.get("/class/:classID/notice", classController.getCourseNotice);
router.get("/class/:classID/talk", classController.getTalk);
router.get("/class/:classID/talk/:talkID", classController.showTalk);
router.get("/class/:classID/talk/:talkID/return", classController.getTalk);
router.get("/:courseNumber", courseControllers.getCourseInfo); //courses/courseNumber

router.post(
  "/class/:classID/notice/updateNotice",
  classController.updateNotice
);
router.post("/class/:classID/talk/updateTalk", classController.writeTalk);
router.post(
  "/class/:classID/talk/:talkID/updateComment",
  classController.addComment
);
//router.get('/courseGrade',courseControllers.getGrade);
//router.get('/courseGradeChange', courseControllers.gradeChange);

//验证身份
router.all("/class/:classID/student/", classController.checkStudent); // courses/classes/:classID/student  ->匹配学生，验证身份，next
router.all("/class/:classID/teacher/", classController.checkTeacher); //判断身份，用next()

//主页
router.get("/class/:classID/student/main", classController.getStuMainPage); // courses/classes/:classID/student/main ->课程主页面
router.get("/class/:classID/teacher/main", classController.getTcMainPage);

//作业
router.get('/class/:classID/student/hw/all', classController.getStuAllHw);// courses/classes/:classID/student/hw/all ->作业列表
router.all('/class/:classID/student/hw/:hw', classController.checkHw);//courses/classes/:classID/student/hw/:hw ->学生作业，验证作业，next
router.get('/class/:classID/student/hw/:hw/detail', classController.getStuHwDetail);// courses/classes/:classID/student/hw/:hw/detail ->作业详情
router.get('/class/:classID/student/hw/:hw/situation',classController.getStuHwSituation);// courses/classes/:classID/student/hw/:hw/situation ->提交和批改情况
router.get('/class/:classID/student/hw/:hw/complain',classController.getStuHwComplain);// courses/classes/:classID/student/hw/:hw/complain ->申诉
router.post('/class/:classID/student/hw/:hw/submitComplain',classController.submitComplain);//处理申诉
router.get('/class/:classID/student/hw/:hw/submit',classController.getStuHwSubmit);// courses/classes/:classID/student/hw/:hw/submit ->提交作业

router.get("/class/:classID/teacher/hw/:hw", classController.checkHw);
router.get("/class/:classID/teacher/hw/all", classController.getTcAllHw);
router.get("/class/:classID/teacher/hw/:hw", classController.getTcHwDetail);
router.get("/class/:classID/teacher/hw/add", classController.addHw);

//申诉？
router.post('/complainBoard', homeworkController.writeComplainBoard);//待定

module.exports = router;
