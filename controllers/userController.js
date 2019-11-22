var User = require('../models/class/User');
var svgCaptcha = require('svg-captcha');  //动态验证码核心库
var indexCourses = require('../models/statics/indexCourses');

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