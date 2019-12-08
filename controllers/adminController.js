var Admin = require('../models/class/Admin');
var Course = require('../models/class/Course');
var config = require('../models/statics/config');

exports.checkAdmin = async (req, res, next) => {
    //for dev-------------
    req.session.token = await config.getToken('admin_01', '123');
    //--------------------
    if (req.session.token == null || req.session.token.userType != config.TYPE_ADMIN) {
        res.send({ status: 0, msg: "您暂无权限访问该页面" }).end();
        return;
    }
    next();
};

/**
 * 用户管理界面
 */
exports.getUserManagerPage = async (req, res) => {
    res.render('admins/index');
};

/**
 * 课程管理界面
 */
exports.getCourseManagerPage = async (req, res) => {
    res.render('admins/course');
};

/**
 * 教学班管理界面
 */
exports.getClassManagerPage = async (req, res) => {
    var ret = await Course.prototype.getCourseClasses(req.query.cn);
    if (ret == null) {
        res.send({ status: 0, msg: '数据库异常，请稍后再试！' }).end();
    } else if (ret.length == 0) {
        res.send({ status: 0, msg: '该课程不存在！' }).end();
    } else {
        res.render('admins/class', { classes: ret });
    }
};

/**
 * 获取用户列表
 */
exports.getUsers = async (req, res) => {
    var ret = await Admin.prototype.getUsers(req.body);
    if (ret == null) {
        res.send({ status: 0, msg: "数据库异常，请稍后再试！" }).end();
    } else {
        res.send({ status: 1, users: ret }).end();
    }
};

/**
 * 批量导入用户
 */
exports.importUsers = async (req, res) => {
    var lists = JSON.parse(req.body.params);
    var ret = await Admin.prototype.importUsers(lists);
    if (ret == null) {
        res.send({ status: 0, msg: "数据库异常，请稍后再试！" }).end();
    } else {
        res.send({ status: 1, errList: ret }).end();
    }
};

/**
 * 批量删除用户
 */
exports.deleteUsers = async (req, res) => {
    var lists = req.body.params;
    var ret = await Admin.prototype.deleteUsers(lists);
    if (ret == null) {
        res.send({ status: 0, msg: "数据库异常，请稍后再试！" }).end();
    } else {
        res.send({ status: 1, errList: ret }).end();
    }
};

/**
 * 修改用户信息
 */
exports.updateUser = async (req, res) => {
    var ret = await Admin.prototype.updateUser(req.body);
    if (ret == null) {
        res.send({ status: 0, msg: "数据库异常，请稍后再试！" }).end();
    } else {
        res.send({ status: 1 }).end();
    }
};

/**
 * 获取课程列表
 */
exports.getCourses = async (req, res) => {
    var ret = await Course.prototype.getCourses(req.body);
    if (ret == null) {
        res.send({ status: 0, msg: "数据库异常，请稍后再试！" }).end();
    } else {
        res.send({ status: 1, courses: ret }).end();
    }
};

/**
 * 导入课程
 */
exports.importCourse = async (req, res) => {
    var ret = await Course.prototype.insertCourse(req.body);
    if (ret != null) {
        res.send({ status: 0, msg: ret }).end();
    } else {
        res.send({ status: 1 }).end();
    }
};

/**
 * 批量删除课程
 */
exports.deleteCourses = async (req, res) => {
    var lists = req.body.params;
    var ret = await Course.prototype.deleteCourses(lists);
    if (ret == null) {
        res.send({ status: 0, msg: "数据库异常，请稍后再试！" }).end();
    } else {
        res.send({ status: 1, errList: ret }).end();
    }
};

/**
 * 修改课程信息
 */
exports.updateCourse = async (req, res) => {
    var ret = await Course.prototype.updateCourse(req.body);
    if (ret != null) {
        res.send({ status: 0, msg: ret }).end();
    } else {
        res.send({ status: 1 }).end();
    }
};

/**
 * 新建教学班
 */
exports.createClass = async (req, res) => {
    req.body.classID = "Class" + new Date().getTime();
    var ret = await Course.prototype.createClass(req.body);
    if (ret != null) {
        res.send({ status: 0, msg: ret }).end();
    } else {
        res.send({ status: 1 }).end();
    }
};

/**
 * 修改教学班
 */
exports.updateClass = async (req, res) => {
    var ret = await Course.prototype.updateClass(req.body);
    if (ret != null) {
        res.send({ status: 0, msg: ret }).end();
    } else {
        res.send({ status: 1 }).end();
    }
};

/**
 * 删除教学班
 */
exports.deleteClass = async (req, res) => {
    var ret = await Course.prototype.deleteClass(req.body.classID);
    if (ret != null) {
        res.send({ status: 0, msg: ret }).end();
    } else {
        res.send({ status: 1 }).end();
    }
};