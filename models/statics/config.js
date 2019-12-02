var exported = {};
var User = require('../class/User');

exported.TYPE_STUDENT = 0;
exported.TYPE_TEACHER = 1;
exported.TYPE_ADMIN = 2;
exported.EMAIL_VALID_TIME = 5 * 60 * 1000;  ////邮件验证码有效时间

/* 自动登录，供测试者测试使用 */
exported.getToken = async (userID, userPwd) => {
    var ret = await User.prototype.login(userID, userPwd);
    return ret[0];
}

module.exports = exported;