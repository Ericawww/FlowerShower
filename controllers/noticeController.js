var Notice = require("../models/class/Notice");

exports.getCourseNotice = async (req, res) => {
  var token = req.session.token;
  var noticeList = await Notice.prototype.getCourseNotice(1); //1应该用课程号替换掉
  res.render("courses/noticePage", { noticeList: noticeList, token: token });
};
