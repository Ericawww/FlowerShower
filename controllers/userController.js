var User = require("../models/class/User");
var Teacher = require("../models/class/Teacher");
var MsgBoard = require("../models/class/MsgBoard");
var mailHelper = require("../models/method/mailHelper");
var utils = require("../models/method/utils");
var svgCaptcha = require("svg-captcha"); //动态验证码核心库
var fs = require("fs"); //文件系统操作
var path = require("path"); //路径操作
var indexCourses = require("../models/statics/indexCourses"); //静态数据
var config = require("../models/statics/config");
var validTime = config.EMAIL_VALID_TIME; //邮件验证码有效时间
var Notice = require("../models/class/Notice");

/**
 * 主页加载，区分登陆态和非登陆态
 */
exports.index = async (req, res) => {
	//for dev-------------
	//var token = await config.getToken('3333','123');
	var token = req.session.token;
	//console.log(token);
	//--------------------
	if (token) {
		res.render('index/index', { courses: indexCourses, token: token });
	} else {
		res.render('index/index', { courses: indexCourses, token: null });
	}
}

/**
 * 用户身份校验，校验成功返回1，校验失败返回0
 */
exports.userVerify = async (req, res) => {
	var ret = await User.prototype.login(req.body.userName, req.body.userPwd); //静态方法
	if (ret == null) {
		res.send({ status: 0, msg: "数据库异常！" }).end();
	} else if (ret.length == 0) {
		res.send({ status: 0, msg: "用户名或密码错误！" }).end();
	} else {
		ret[0].userPwd = null; //清除密码
		req.session.token = ret[0];
		res.send({ status: 1 }).end();
	}
};

/**
 * 用户注销
 */
exports.userLogout = (req, res) => {
	req.session.destroy();
	res
		.send("<script>alert('注销成功'); window.location.href = '/';</script>")
		.end();
};

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
};

/**
 * 留言板反馈
 */
exports.writeMsgBoard = async (req, res) => {
	var ret = await MsgBoard.prototype.writeMsg(
		req.body.content,
		req.body.contact
	);
	if (ret) {
		res.send({ status: 1 }).end();
	} else {
		res.send({ status: 0, msg: "数据库出现异常请稍后再试！" }).end();
	}
};

/**
 * 生成动态验证码返回给前端
 */
exports.getCaptcha = (req, res) => {
	try {
		var captcha = svgCaptcha.create();
		req.session.captcha = captcha.text; //生成动态码存到session中并返回给前端
		console.log(req.session.captcha);
		res.type("svg");
		res.status(200).send(captcha.data);
	} catch (err) {
		console.log(err);
	}
};

/**
 * 重置密码时发送动态验证码
 */
exports.mailVerifyCode = (req, res) => {
	var resetCode = utils.randomString(6);
	var mailTemplate = `<div>您的重置验证码是：${resetCode}，请在5分钟之内输入！</div>`;
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
			};
			console.log(req.session.resetStat);
			res.send({ status: 1 }).end();
		}
	});
};

/**
 * 重置验证码
 */
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
		var ret = await User.prototype.reset(
			req.session.resetStat.email,
			req.body.userPwd
		);
		if (ret) {
			req.session.resetStat = null;
			res.send({ status: 1 }).end();
		} else {
			res.send({ status: 0, msg: "系统数据库异常，请稍后再试！" }).end();
		}
	}
};

/**
 * 用户设置
 */
exports.userSettings = async (req, res) => {
	//for dev-------------
	//req.session.token = await config.getToken("1111", "123");
	//console.log(req.session.token);
	//--------------------
	if (req.session.token == null) {
		res.send("<script>alert('您暂无权限访问该页面，请先登录！'); window.location.href='/';</script>");
		return;
	}
	var token = req.session.token;
	token.birth = utils.dateFormat(token.birth, "yyyy-MM-dd");
	if (parseInt(token.userType) == config.TYPE_TEACHER) {  //如果身份是教师还需要传送教师个人主页
		var ret = await Teacher.prototype.getHomePage(token.userID);
		console.log(ret);
		if (ret == null) {
			res.render('users/index', { token: token, person: null });
		} else {
			res.render('users/index', { token: token, person: ret });
		}
	} else {
		res.render('users/index', { token: token, person: null });
	}
}

/**
 * 用户上传头像
 */
exports.userChangeImage = async (req, res) => {
	//for dev-------------
	//req.session.token = await config.getToken("1111", "123");
	//--------------------
	if (req.session.token == null) {
		res.send({ status: 0, msg: "不合法的用户信息，请先登录！" });
		return;
	}
	try {
		var base64Data = decodeURIComponent(req.body.imgBase64).replace(/^data:image\/\w+;base64,/, "").replace(/\s/g, "+");
		var dataBuffer = Buffer.from(base64Data, 'base64');
		var curTime = new Date().getTime() + ".jpeg";
		var newFileName = path.join(__dirname, "../", "/public/photos/", curTime); //采用时间戳命名
		fs.writeFile(newFileName, dataBuffer, async (err) => {
			if (err) {
				console.log(err);
				res.send({ status: 0, msg: "上传失败，请稍后再试！" });
				return;
			} else {
				try { //修改数据库中的路径
					await User.prototype.updatePhotoSrc(req.session.token.userID, 'photos/' + curTime);
				} catch (err) {
					console.log(err);
					res.send({ status: 0, msg: "数据库出现异常，请稍后再试！" });
					return;
				}
				try { //删除老的图片
					if (req.session.token.userPhoto) {
						var oldFileName = path.join(__dirname, "../", "/public/", req.session.token.userPhoto);
						await utils.removeFile(oldFileName);
					}
					req.session.token.userPhoto = 'photos/' + curTime; //修改缓存信息
					res.send({ status: 1, newPath: req.session.token.userPhoto });
				} catch (err) {
					console.log(err);
				}
			}
		});
	} catch (err) {
		console.log(err);
		res.send({ status: 0, msg: "上传失败，请稍后再试！" });
	}
}

/**
 * 修改用户信息
 */
exports.updateUserInfo = async (req, res) => {
	if (req.session.token == null) {
		res.send({ status: 0, msg: "您暂无权限访问该页面，请先登录！" }).end();
		return;
	}
	var ret = await User.prototype.updateUserInfo({
		userID: req.session.token.userID,
		userName: req.body.userName,
		phoneNumber: req.body.phoneNumber,
		gender: req.body.gender,
		birth: req.body.birth,
		userIntro: req.body.userIntro
	});
	if (ret == null) {
		res.send({ status: 0, msg: "该用户信息不存在，请重新登录！" }).end();
	} else {
		req.session.token = ret;
		res.send({ status: 1 }).end();
	}
}

/**
 * 修改用户密码
 */
exports.updateUserPwd = async (req, res) => {
	if (req.session.token == null) {
		res.send({ status: 0, msg: "您暂无权限访问该页面，请先登录！" }).end();
		return;
	}
	var checkFlag = await User.prototype.login(req.session.token.userID, req.body.oldPwd);
	console.log(checkFlag);
	if (checkFlag == null || checkFlag.length == 0) {
		res.send({ status: 0, msg: "原密码输入错误！" }).end();
		return;
	} else {
		var ret = await User.prototype.updateUserInfo({ userID: req.session.token.userID, userPwd: req.body.newPwd });
		if (ret == null) {
			res.send({ status: 0, msg: "该用户信息不存在，请重新登录！" }).end();
		} else {
			req.session.token = ret;
			res.send({ status: 1 }).end();
		}
	}
}

/**
 * 用户个人主页
 */
exports.userIndex = async (req, res) => {
	res.render("users/userPage");
};
