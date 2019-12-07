var express = require("express");
var router = express.Router();
var courseController = require("../controllers/courseController");
var classController = require("../controllers/classController");
var homeworkController = require("../controllers/homeworkController");

router.get("/", courseController.getAllCourse); //courses
router.get("/search", courseController.getCourseByName); //search?courseName=...
router.get("/class/:classID", courseController.getUserCoursePage);
router.get("/class/:classID/student/notice", classController.getCourseNotice);
router.get("/class/:classID/student/talk", classController.getTalk);
router.get("/class/:classID/student/talk/:talkID", classController.showTalk);
router.get("/class/:classID/student/talk/:talkID/return", classController.getTalk);

router.get("/class/:classID/teacher/notice", classController.getCourseNotice);
router.get("/class/:classID/teacher/talk", classController.getTalk);
router.get("/class/:classID/teacher/talk/:talkID", classController.showTalk);
router.get("/class/:classID/teacher/talk/:talkID/return", classController.getTalk);

router.post(
  "/class/:classID/notice/updateNotice",
  classController.updateNotice
);
router.post("/class/:classID/talk/updateTalk", classController.writeTalk);
router.post(
  "/class/:classID/talk/:talkID/updateComment",
  classController.addComment
);

router.post("/class/:classID/student/notice/updateNotice", classController.updateNotice);
router.post("/class/:classID/student/talk/updateTalk", classController.writeTalk);
router.post("/class/:classID/student/talk/:talkID/updateComment", classController.addComment);

router.post("/class/:classID/teacher/notice/updateNotice", classController.updateNotice);
router.post("/class/:classID/teacher/talk/updateTalk", classController.writeTalk);
router.post("/class/:classID/teacher/talk/:talkID/updateComment", classController.addComment);

//成绩
router.get("/class/:classID/teacher/courseGrade", courseController.getGrade);
router.get(
  "/class/:classID/teacher/courseGradeChange",
  courseController.gradeChange
);
router.post(
  "/class/:classID/teacher/gradeChange",
  courseController.setGradeChange
);
router.post(
  "/class/:classID/teacher/gradeWeightChange",
  courseController.setGradeWeightChange
);

//验证身份
router.all("/class/:classID/student/", classController.checkStudent); // courses/classes/:classID/student  ->匹配学生，验证身份，next
router.all("/class/:classID/teacher/", classController.checkTeacher); //判断身份，用next()

//主页
router.get("/class/:classID/student/main", classController.getStuMainPage); // courses/classes/:classID/student/main ->课程主页面
router.get("/class/:classID/teacher/main", classController.getTcMainPage);

//作业
router.get('/class/:classID/student/hw/all', classController.getStuAllHw);// courses/classes/:classID/student/hw/all ->作业列表
//hw检查作业有问题
//router.all('/class/:classID/student/hw/:hw', classController.checkHw);//courses/classes/:classID/student/hw/:hw ->学生作业，验证作业，next
router.get('/class/:classID/student/hw/:hw/detail', classController.getStuHwDetail);// courses/classes/:classID/student/hw/:hw/detail ->作业详情
router.get('/class/:classID/student/hw/:hw/situation',classController.getStuHwSituation);// courses/classes/:classID/student/hw/:hw/situation ->提交和批改情况
router.post('/class/:classID/student/hw/:hw/submitComplain',classController.submitComplain);//处理申诉
router.post('/class/:classID/student/hw/:hw/submitHw',classController.submitHw);//处理申诉
router.get('/class/:classID/student/hw/:hw/submit',classController.getStuHwSubmit);// courses/classes/:classID/student/hw/:hw/submit ->提交作业

//router.get("/class/:classID/teacher/hw/:hw", classController.checkHw);
router.get("/class/:classID/teacher/hw/all", classController.getTcAllHw);
router.get("/class/:classID/teacher/hw/add", classController.addHw);
router.get("/class/:classID/teacher/hw/:hw/detail", classController.getTcHwDetail);
router.get("/class/:classID/teacher/hw/:hw/complain", classController.dealComplain);
router.get("/class/:classID/teacher/hw/:hw/submit", classController.getSubmitSituation);
router.get("/class/:classID/teacher/hw/:hw/grade", classController.getGradeSituation);
router.get("/class/:classID/teacher/hw/:hw/update", classController.updateHwPage);
router.get("/class/:classID/teacher/hw/:hw/mark", classController.markHwPage);


router.post("/class/:classID/teacher/hw/:hw/update/changeHw",classController.changeHw)
router.post("/class/:classID/teacher/hw/verifyAddHw",classController.updateHw);

router.post("/class/:classID/teacher/hw/:hw/updateScore", classController.updateScore);
router.post("/class/:classID/teacher/hw/:hw/rejectComment", classController.rejectComplain);
// router.post("/class/:classID/teacher/hw/:hw/deleteHw", classController.deleteHw);

//申诉？
router.post("/complainBoard", homeworkController.writeComplainBoard); //待定
router.get("/:courseNumber", courseController.getCourseInfo); //courses/courseNumber

router.post("/class/:classID/notice/updateNotice", classController.updateNotice);
router.post("/class/:classID/talk/updateTalk", classController.writeTalk);
router.post("/class/:classID/talk/:talkID/updateComment", classController.addComment);

module.exports = router;
