var Talk = require("../models/class/Talk");

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
