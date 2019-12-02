var Admin = require('../models/class/Admin');
var config = require('../models/statics/config');

/**
 * 用户管理界面
 */
exports.getUserManagerPage = async (req, res) => {
    //for dev-------------
    req.session.token = await config.getToken('3333', '123');
    //--------------------
    if (req.session.token == null || req.session.token.userType != config.TYPE_ADMIN) {
        res.send("<script>alert('您暂无权限访问该页面！'); window.location.href='/';</script>");
        return;
    }
    res.render('admins/index');
}

/**
 * 获取用户列表
 */
exports.getUsers = async (req, res) => {
    //for dev-------------
    req.session.token = await config.getToken('3333', '123');
    //--------------------
    if (req.session.token == null || req.session.token.userType != config.TYPE_ADMIN) {
        res.send("<script>alert('您暂无权限访问该页面！'); window.location.href='/';</script>");
        return;
    }
    var ret = await Admin.prototype.getUsers(req.body);
    if (ret == null) {
        res.send({ status: 0, msg: "数据库异常，请稍后再试！" }).end();
    } else {
        res.send({ status: 1, users: ret }).end();
    }
}

/**
 * 批量导入用户
 */
exports.importUsers = async (req, res) => {
    //for dev-------------
    req.session.token = await config.getToken('3333', '123');
    //--------------------
    if (req.session.token == null || req.session.token.userType != config.TYPE_ADMIN) {
        res.send({ status: 0, msg: "您暂无权限访问该页面" }).end();
        return;
    }
    var lists = JSON.parse(req.body.params);
    var ret = await Admin.prototype.importUsers(lists);
    if (ret == null) {
        res.send({ status: 0, msg: "数据库异常，请稍后再试！" }).end();
    } else {
        res.send({ status: 1, errList: ret }).end();
    }
}

/**
 * 批量删除用户
 */
exports.deleteUsers = async (req, res) => {
    //for dev-------------
    req.session.token = await config.getToken('3333', '123');
    //--------------------
    if (req.session.token == null || req.session.token.userType != config.TYPE_ADMIN) {
        res.send({ status: 0, msg: "您暂无权限访问该页面" }).end();
        return;
    }
    var lists = req.body.params;
    var ret = await Admin.prototype.deleteUsers(lists);
    if (ret == null) {
        res.send({ status: 0, msg: "数据库异常，请稍后再试！" }).end();
    } else {
        res.send({ status: 1, errList: ret }).end();
    }
}

/**
 * 修改用户信息
 */
exports.updateUser = async (req, res) => {
    //for dev-------------
    req.session.token = await config.getToken('3333', '123');
    //--------------------
    if (req.session.token == null || req.session.token.userType != config.TYPE_ADMIN) {
        res.send({ status: 0, msg: "您暂无权限访问该页面" }).end();
        return;
    }
    var ret = await Admin.prototype.updateUser(req.body);
    if (ret == null) {
        res.send({ status: 0, msg: "数据库异常，请稍后再试！" }).end();
    } else {
        res.send({ status: 1 }).end();
    }
}