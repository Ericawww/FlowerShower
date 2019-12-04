var Class = require('../models/class/Class');
var config = require('../models/statics/config');

//验证
/**
 * 判断当前用户是否为教师，是则进行路由匹配，否则返回错误信息
 */
exports.checkTc = async (req, res, next) => {
    if (req.session.token == null || req.session.token.userType != config.TYPE_TEACHER) {
        res.send({ status: 0, msg: "您暂无权限访问该页面" }).end();
        return;
    }
    next();
}
/**
 * 判断当前用户是否为学生，是则进行路由匹配，否则返回错误信息
 */
exports.checkStudent = async (req, res, next) => {
    if (req.session.token == null || req.session.token.userType != config.TYPE_STUDENT) {
        res.send({ status: 0, msg: "您暂无权限访问该页面" }).end();
        return;
    }
    next();
}
/**
 * 判断当前作业号是否存在，是则进行路由匹配，否则返回错误信息
 */
exports.checkHw = async (req, res, next) => {
    var hw = await Homework.prototype.isExistHw({hwID: req.params.hw});
    if (hw==null) {
        res.send({ status: 0, msg: "该作业不存在！" }).end();
        return;
    }
    next();
}

//主页
exports.getStuMainPage= async (req, res) => {
    res.render('courses/coursePage');//TODO：不同页面的不同名称。
}
exports.getTcMainPage = async (req, res) => {
    res.render('courses/coursePage');
}

//学生作业
exports.getStuAllHw = async (req, res) => {
    
    
    res.render('homework/studentHomeworkListPage');
}

exports.getStuHwDetail = async (req, res) => {
    res.render('homework/studentHomeworkDetail');
}

exports.getStuHwSituation = async (req, res) => {
    res.render('homework/studentHomeworkSituation');
}

exports.getStuHwComplain = async (req, res) => {
    res.render('homework/studentHomeworkComplain');
}

exports.getStuHwSubmit = async (req, res) => {
    res.render('homework/studentHomeworkSubmit');
}


//教师作业
exports.getTcAllHw= async (req, res) => {
    res.render('homework/teacherHomeworkDetail');
}

exports.getTcHwDetail= async (req, res) => {
    res.render('homework/teacherHomeworkDetail');
}


exports.addHw= async (req, res) => {
    res.render('homework/teacherHomeworkAdd');
}