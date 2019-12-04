var Class = require("../models/class/Class");
var config = require("../models/statics/config");
var Talk = require("../models/class/Talk");
var Notice = require("../models/class/Notice");

//验证
/**
 * 判断当前用户是否为教师，是则进行路由匹配，否则返回错误信息
 */
exports.checkTc = async (req, res, next) => {
  if (
    req.session.token == null ||
    req.session.token.userType != config.TYPE_TEACHER
  ) {
    res.send({ status: 0, msg: "您暂无权限访问该页面" }).end();
    return;
  }
  next();
};
/**
 * 判断当前用户是否为学生，是则进行路由匹配，否则返回错误信息
 */
exports.checkStudent = async (req, res, next) => {
  if (
    req.session.token == null ||
    req.session.token.userType != config.TYPE_STUDENT
  ) {
    res.send({ status: 0, msg: "您暂无权限访问该页面" }).end();
    return;
  }
  next();
};
/**
 * 判断当前作业号是否存在，是则进行路由匹配，否则返回错误信息
 */
exports.checkHw = async (req, res, next) => {
  var hw = await Homework.prototype.isExistHw({ hwID: req.params.hw });
  if (hw == null) {
    res.send({ status: 0, msg: "该作业不存在！" }).end();
    return;
  }
  next();
};

//主页
exports.getStuMainPage = async (req, res) => {
  res.render("courses/coursePage"); //TODO：不同页面的不同名称。
};
exports.getTcMainPage = async (req, res) => {
  res.render("courses/coursePage");
};

//学生作业
exports.getStuAllHw = async (req, res) => {
  res.render("homework/studentHomeworkListPage");
};

exports.getStuHwDetail = async (req, res) => {
  res.render("homework/studentHomeworkDetail");
};

exports.getStuHwSituation = async (req, res) => {
  res.render("homework/studentHomeworkSituation");
};

exports.getStuHwComplain = async (req, res) => {
  res.render("homework/studentHomeworkComplain");
};

exports.getStuHwSubmit = async (req, res) => {
  res.render("homework/studentHomeworkSubmit");
};

//教师作业
exports.getTcAllHw = async (req, res) => {
  res.render("homework/teacherHomeworkDetail");
};

exports.getTcHwDetail = async (req, res) => {
  res.render("homework/teacherHomeworkDetail");
};

exports.addHw = async (req, res) => {
  res.render("homework/teacherHomeworkAdd");
};

/**
 * 获得进入通知页面，获得通知
 */
exports.getCourseNotice = async (req, res) => {
  var token = req.session.token;
  console.log(req.params.classID);
  var noticeList = await Notice.prototype.getCourseNotice(req.params.classID); //用课程号替换掉
  res.render("courses/noticePage", { noticeList: noticeList, token: token });
};

/**
 * 教师发布通知
 */
exports.updateNotice = async (req, res) => {
  var token = req.session.token;
  var noticeList = await Notice.prototype.getCourseNotice(req.params.classID); //用课程号替换掉
  //TO-DO
  await Notice.prototype.updataNotice();
  res.render("courses/noticePage", { noticeList: noticeList, token: token });
};

/**
 * 获得帖子
 */
exports.getTalk = async (req, res) => {
  var token = req.session.token;
  var talkList = await Talk.prototype.getTalk(1); //1应该用课程号替换掉
  res.render("courses/talkBoard", { talkList: talkList, token: token });
};

/**
 * 发布帖子
 */
exports.writeTalk = async (req, res) => {
  var ret = await Talk.prototype.writeTalk(
    req.body.title,
    req.body.content,
    req.body.time
  );
  if (ret) {
    res.send({ status: 1 }).end();
  } else {
    res.send({ status: 0, msg: "数据库出现异常请稍后再试！" }).end();
  }
};
