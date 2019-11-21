var User = require('../models/class/User');

/**
 * 用户身份校验，校验成功返回1，校验失败返回0
 */
exports.userVerify = async (req, res) => {
    var ret = await User.prototype.login(req.body.userName, req.body.userPwd);  //静态方法
    if (ret == null) {
        res.send({ status: 0, msg: "数据库异常！" }).end();
    } else if (ret.length == 0) {
        res.send({ status: 0, msg: "用户名或密码错误！" }).end();
    } else {
        req.session.token = ret[0];
        res.send({ status: 1 }).end();
    }
}