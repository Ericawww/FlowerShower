var Homework = require('../models/class/Homework');

/**
 * 申诉成绩框反馈
 */
exports.writeComplainBoard = async (req, res) => {
    var ret = await ComplainBoard.prototype.writeComplain(req.body.reason, req.body.contact);
    if (ret) {
        res.send({ status: 1 }).end();
    } else {
        res.send({ status: 0, msg: "数据库出现异常请稍后再试！" }).end();
    }
}
