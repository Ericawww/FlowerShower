var User = require('../models/class/User');
var MsgBoard = require('../models/class/MsgBoard');
var mailHelper = require('../models/method/mailHelper');
var utils = require('../models/method/utils');
var svgCaptcha = require('svg-captcha');  //动态验证码核心库
var indexCourses = require('../models/statics/indexCourses');  //静态数据

/**
 * 主页加载，区分登陆态和非登陆态
 */
exports.index = (req, res) => {
    var token = req.session.token;
    if (token) {
        token.userPwd = null; //隐蔽用户密码
        res.render('index/index', { courses: indexCourses, token: token });
    } else {
        res.render('index/index', { courses: indexCourses, token: null });
    }
}

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

/**
 * 用户注销
 */
exports.userLogout = (req, res) => {
    req.session.destroy();
    res.send("<script>alert('注销成功'); window.location.href = '/';</script>").end();
}

/**
 * 用户注册，注册成功返回1，注册失败返回0，验证码错误返回-1
 */
exports.userRegist = async (req, res) => {
    if (!req.session.captcha || req.session.captcha != req.body.dynamic) {
        res.send({ status: -1, msg: "验证码错误！" }).end();
        return;
    }
    var ret = await User.prototype.regist(req.body);
    if (ret == null) {
        res.send({ status: 0, msg: "数据库异常！" }).end();
    } else if (ret == 0) {
        res.send({ status: 0, msg: "邮箱已被注册！" }).end();
    } else {
        res.send({ status: 1 }).end();
    }
}

/**
 * 留言板反馈
 */
exports.writeMsgBoard = async (req, res) => {
    var ret = await MsgBoard.prototype.writeMsg(req.body.content, req.body.contact);
    if (ret) {
        res.send({ status: 1 }).end();
    } else {
        res.send({ status: 0, msg: "数据库出现异常请稍后再试！" }).end();
    }
}

/**
 * 生成动态验证码返回给前端
 */
exports.getCaptcha = (req, res) => {
    try {
        var captcha = svgCaptcha.create();
        req.session.captcha = captcha.text; //生成动态码存到session中并返回给前端
        console.log(req.session.captcha);
        res.type('svg');
        res.status(200).send(captcha.data);
    } catch (err) {
        console.log(err);
    }
}

/**
 * 重置密码时发送动态验证码
 */
exports.mailVerifyCode = (req, res) => {
    var resetCode = utils.randomString(6);
    var mailTemplate =
        `<div>您的重置验证码是：${resetCode}，请在5分钟之内输入！</div>`;
    var mailOptions = {
        from: '"ZJUSRE-G13" <ZJUSRE_G13_2019@163.com>',
        to: req.body.email,
        subject: "【高等学校在线教学平台】重置密码",
        html: mailTemplate
    };
    mailHelper.sendMail(mailOptions, (err, ret = {}) => {
        if (err) {
            console.log(err);
            res.send({ status: 0 }).end();
        } else {
            req.session.resetStat = {
                resetCode: resetCode,
                email: req.body.email,
                time: new Date().getTime()
            }
            console.log(req.session.resetStat);
            res.send({ status: 1 }).end();
        }
    });
}

/**
 * 重置验证码
 */
const validTime = 5 * 60 * 1000;
exports.resetPasswd = async (req, res) => {
    var now = new Date();
    console.log(now.getTime() - req.session.resetStat.time);
    if (req.session.resetStat == null) {
        res.send({ status: 0, msg: "请先发送验证码！" }).end();
    } else if (now - req.session.resetStat.time >= validTime) {
        res.send({ status: 0, msg: "验证码已过期，请重新发送！" }).end();
    } else if (req.body.resetCode != req.session.resetStat.resetCode) {
        res.send({ status: 0, msg: "重置验证码错误！" }).end();
    } else {
        var ret = await User.prototype.reset(req.session.resetStat.email, req.body.userPwd);
        if (ret) {
            req.session.resetStat = null;
            res.send({ status: 1 }).end();
        } else {
            res.send({ status: 0, msg: "系统数据库异常，请稍后再试！"  }).end();
        }
    }
}