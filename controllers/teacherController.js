var Teacher = require('../models/class/Teacher');

/**
 * 教师更新个人主页
 */
exports.updateTeacherPage = async (req, res) => {
    if (req.session.token == null) {
        res.send({ status: 0, msg: "您暂无权限访问该页面，请先登录！" }).end();
        return;
    }
    req.body.teacherID = req.session.token.userID;
    var ret = await Teacher.prototype.updateHomePage(req.body);
    if (ret) {
        res.send({ status: 1 }).end();
    } else {
        res.send({ status: 0, msg: "数据库异常，请稍后再试！" }).end();
    }
}