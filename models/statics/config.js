var exported = {};
var User = require('../class/User');

exported.TYPE_STUDENT = 0;
exported.TYPE_TEACHER = 1;
exported.TYPE_ADMIN = 2;
exported.EMAIL_VALID_TIME = 5 * 60 * 1000;  //邮件验证码有效时间
exported.FILE_MAX_SIZE = 20 * 1024 * 1024;  //文件上传的大小不能超过20MB
exported.FILE_EXCLUDE_TYPE = "";  //文件上传格式黑名单  [eg: ".exe.js"]

/* 自动登录，供测试者测试使用 */
exported.getToken = async (userID, userPwd) => {
    var ret = await User.prototype.login(userID, userPwd);
    return ret[0];
};

module.exports = exported;