var express = require("express");
var router = express.Router();
var courseController = require("../controllers/courseController");
var classController = require("../controllers/classController");
var quizController = require("../controllers/quizController");

/**
 * 验证阶段
 */
router.use("/class/:classID", classController.checkClassMember);  //验证是否是教学班的成员
router.use("/class/:classID/student/", classController.checkStudent); //验证教师或助教身份
router.use("/class/:classID/teacher/", classController.checkTeacher); //验证学生身份

/**
 * 课程主页
 */
router.get("/", courseController.getAllCourse); //全部课程
router.get("/search", courseController.getCourseByName); //根据名字搜索某一个具体的课程

/**
 * 课程分组
 */
router.get("/class/:classID/student/groupInfo", courseController.getGroupInfo);
router.get("/class/:classID/teacher/groupOperation", courseController.groupOperation);
router.post("/class/:classID/teacher/addGroupMember", courseController.addGroupMember);
router.post("/class/:classID/teacher/removeGroupMember", courseController.removeGroupMember);
router.post("/class/:classID/teacher/changeGroupLeader", courseController.changeGroupLeader);
router.post("/class/:classID/teacher/addNewGroup", courseController.addNewGroup);

/**
 * 教学班主页
 */
router.get("/class/:classID/student/main", classController.getStuMainPage);
router.get("/class/:classID/teacher/main", classController.getTcMainPage);

/**
 * 教学班讨论版和公告
 */
router.get("/class/:classID/student/notice", classController.getCourseNotice);
router.get("/class/:classID/student/talk", classController.getTalk);
router.get("/class/:classID/student/talk/:talkID", classController.showTalk);
router.post("/class/:classID/student/talk/:talkID/deleteTalk", classController.deleteTalk);
router.get("/class/:classID/student/talk/:talkID/return", classController.getTalk);

router.get("/class/:classID/teacher/notice", classController.getCourseNotice);
router.get("/class/:classID/teacher/talk", classController.getTalk);
router.get("/class/:classID/teacher/talk/:talkID", classController.showTalk);
router.post("/class/:classID/teacher/talk/:talkID/addLikes", classController.addLikes);
router.post("/class/:classID/teacher/talk/:talkID/deleteTalk", classController.deleteTalk);
router.get("/class/:classID/teacher/talk/:talkID/return", classController.getTalk);

router.post("/class/:classID/student/notice/updateNotice", classController.updateNotice);
router.post("/class/:classID/student/talk/updateTalk", classController.writeTalk);
router.post("/class/:classID/student/talk/:talkID/updateComment", classController.addComment);
router.post("/class/:classID/student/talk/:talkID/addLikes", classController.addLikes);
router.post("/class/:classID/teacher/notice/updateNotice", classController.updateNotice);
router.post("/class/:classID/teacher/talk/updateTalk", classController.writeTalk);
router.post("/class/:classID/teacher/talk/:talkID/updateComment", classController.addComment);

/**
 * 课程成绩管理
 */
router.get('/class/:classID/teacher/courseGrade', courseController.getGrade);
router.get('/class/:classID/teacher/courseGradeChange', courseController.gradeChange);
router.post('/class/:classID/teacher/gradeChange', courseController.setGradeChange);
router.post('/class/:classID/teacher/gradeWeightChange', courseController.setGradeWeightChange);

/**
 * 课程资料管理
 */
router.post('/class/:classID/teacher/material/receive', classController.receiveTeacherMaterial);
router.get('/class/:classID/teacher/material/download/:materialID', classController.downloadClassMaterial);
router.post('/class/:classID/teacher/material/remove', classController.removeClassMaterial);
router.get('/class/:classID/teacher/material', classController.getTeacherMaterialPage);
router.get('/class/:classID/student/material', classController.getStudentMaterialPage);
router.get('/class/:classID/student/material/download/:materialID', classController.downloadClassMaterial);

/**
 * 课程作业管理
 */
router.get('/class/:classID/student/hw/all', classController.getStuAllHw);// courses/classes/:classID/student/hw/all ->作业列表
//router.use('/class/:classID/student/hw/:hw', classController.checkHw);//courses/classes/:classID/student/hw/:hw ->学生作业，验证作业，next
router.get('/class/:classID/student/hw/:hw/detail', classController.getStuHwDetail);// courses/classes/:classID/student/hw/:hw/detail ->作业详情
router.get('/class/:classID/student/hw/:hw/situation', classController.getStuHwSituation);// courses/classes/:classID/student/hw/:hw/situation ->提交和批改情况
router.post('/class/:classID/student/hw/:hw/submitComplain', classController.submitComplain);//处理申诉
router.post('/class/:classID/student/hw/:hw/submit', classController.submitHw);
router.get('/class/:classID/student/hw/:hw/myhw', classController.downloadHomeworkMaterial);
router.get('/class/:classID/student/hw/:hw/submit', classController.getStuHwSubmit);// courses/classes/:classID/student/hw/:hw/submit ->提交作业


//router.get("/class/:classID/teacher/hw/:hw", classController.checkHw);
router.get("/class/:classID/teacher/hw/all", classController.getTcAllHw);
router.get("/class/:classID/teacher/hw/add", classController.addHw);
router.get("/class/:classID/teacher/hw/:hw/detail", classController.getTcHwDetail);
router.get("/class/:classID/teacher/hw/:hw/complain", classController.dealComplain);
router.get("/class/:classID/teacher/hw/:hw/submit", classController.getSubmitSituation);
router.get("/class/:classID/teacher/hw/:hw/grade", classController.getGradeSituation);
router.get("/class/:classID/teacher/hw/:hw/update", classController.updateHwPage);
router.get("/class/:classID/teacher/hw/:hw/mark", classController.markHwPage);

router.post("/class/:classID/teacher/hw/:hw/assignMark", classController.assignMark);
router.post("/class/:classID/teacher/hw/:hw/update/changeHw", classController.changeHw);
router.post("/class/:classID/teacher/hw/verifyAddHw", classController.updateHw);

router.post("/class/:classID/teacher/hw/:hw/updateScore", classController.updateScore);
router.post("/class/:classID/teacher/hw/:hw/rejectComment", classController.rejectComplain);
router.post("/class/:classID/teacher/hw/:hw/deleteHw", classController.deleteHw);

/**
 * 课程助教管理
 */
router.get("/class/:classID/teacher/assistant", classController.getAssistantManagerPage);
router.get("/class/:classID/teacher/assistant/get", classController.getAssistants);
router.post("/class/:classID/teacher/assistant/insert", classController.insertAssistant);
router.post("/class/:classID/teacher/assistant/delete", classController.deleteAssistant);
router.post("/class/:classID/teacher/assistant/update", classController.updateAssistant);

/**
 * 课程测验
 */
router.get("/class/:classID/teacher/quiz/bank", quizController.getProblemBankPage); //getProblemBank
router.get("/class/:classID/teacher/quiz/all", quizController.getQuiz); //getQuiz
router.get("/class/:classID/student/quiz/problems", quizController.getQuizProblems);  //getQuizProblems
router.post("/class/:classID/teacher/quiz/bank/create", quizController.createProblem);  //createProblem
router.post("/class/:classID/teacher/quiz/bank/delete", quizController.deleteProblem); //deleteProblem
router.post("/class/:classID/teacher/quiz/insert", quizController.insertProblemToQuiz); //insertProblemToQuiz
router.post("/class/:classID/teacher/quiz/remove", quizController.removeProblemFromQuiz); //removeProblemFromQuiz
router.post("/class/:classID/student/quiz/submit", quizController.submitQuiz); //submitQuiz


router.post("/enterClass", classController.enterClass);
router.get("/:courseNumber", courseController.getCourseInfo); //courses/courseNumber

module.exports = router;
