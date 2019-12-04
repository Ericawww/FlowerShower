var Notice = require("../models/class/Notice");

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
