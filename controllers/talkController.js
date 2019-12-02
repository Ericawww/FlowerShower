var Talk = require("../models/class/Talk");

exports.index = (req, res) => {
  var token = req.session.token;
  if (token) {
    res.render("courses/talkBoard", { token: token });
  } else {
    res.render("courses/talkBoard", { token: null });
  }
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
