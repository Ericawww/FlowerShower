var Class = require('../models/class/Classes');
var config = require('../models/statics/config');
var Homework = require('../models/class/Homework');
var Talk = require("../models/class/Talk");
var Notice = require("../models/class/Notice");

//验证
/**
 * 判断当前用户是否为教师，是则进行路由匹配，否则返回错误信息
 */
exports.checkTeacher = async (req, res, next) => {
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
};
/**
 *判断当前classID是否存在，是则进行路由匹配，否则返回错误信息
 */

/**
 * 判断当前作业号是否存在，是则进行路由匹配，否则返回错误信息
 */
exports.checkHw = async (req, res, next) => {
    var hw = await Classes.prototype.isExistHw({ hwID: req.params.hw });
    if (hw == 0) {
        res.send({ status: 0, msg: "该作业不存在！" }).end();
        return;
    }
    next();
}

//主页
/**
 * 得到一门课的简要信息用作页首：(course.courseName,courseDept)课程的课程名称、开课学院、(class.startTime/closeTime)班级的开始时间、结束时间、（user.userName)授课老师名称
 */
exports.getStuMainPage = async (req, res) => {
    console.log(req.params);
    console.log("?");
    var classHeader = await Class.prototype.getClassHeader({ classID: req.params.classID });
    res.render('courses/coursePage', { classHeader: classHeader });
}

exports.getTcMainPage = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader({ classID: req.params.classID });
    res.render('courses/coursePage', { classHeader: classHeader });
}

//学生作业
/**
 * 得到所有作业，若不存在为null
 */
exports.getStuAllHw = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader({ classID: req.params.classID });
    var hwList = await Homework.prototype.getAllHw({ classID: req.params.classID });
    res.render('homework/studentHomeworkListPage', { hwList: hwList, classHeader: classHeader });
}

/**
 * 作业详细信息-得到hw标识的作业详细信息-已判断存在（checkHw)。
 */
exports.getStuHwDetail = async (req, res) => {
    //dev---fake session
    req.session.token = await config.getToken('9999', '123')
    var hwInfo = await Homework.prototype.getHwInfo({ hwID: req.params.hw, stuID: req.session.token.userID });
    res.render('homework/studentHomeworkDetail', { hwInfo: hwInfo });
}

/**
 * 作业详细信息-得到hw标识的作业详细信息-已判断存在（checkHw)。
 * 
 */
exports.getStuHwSituation = async (req, res) => {
    var hwInfo = await Homework.prototype.getHwInfo({ hwID: req.params.hw });
    res.render('homework/studentHomeworkSituation', { hwInfo: hwInfo });
}

/**
 * 跳转至申诉界面，上传暂时不会，要用两次路由匹配？
 */
exports.getStuHwComplain = async (req, res) => {
    res.render("homework/studentHomeworkComplain");
};

/**
 * 跳转至提交页面，需要一点信息
 */
exports.getStuHwSubmit = async (req, res) => {
    var hwInfo = await Homework.prototype.getHwInfo({ hwID: req.params.hw });
    res.render('homework/studentHomeworkSubmit', { hwInfo: hwInfo });
}

//教师作业
exports.getTcAllHw = async (req, res) => {
    res.render("homework/teacherHomeworkDetail");
};

exports.getTcHwDetail = async (req, res) => {
    res.render("homework/teacherHomeworkDetail");
};

exports.addHw = async (req, res) => {
    res.render("homework/teacherHomeworkAdd");
};

/**
 * 获得进入通知页面，获得通知
 */
exports.getCourseNotice = async (req, res) => {
    var token = req.session.token;
    var noticeList = await Notice.prototype.getCourseNotice(req.params.classID); //用课程号替换掉
    res.render("courses/noticePage", { noticeList: noticeList, token: token });
};

/**
 * 教师发布通知
 */
exports.updateNotice = async (req, res) => {
    var ret = await Notice.prototype.updataNotice(
        req.params.classID,
        req.body.title,
        req.body.content
    );
    if (ret) {
        var url = "localhost" + req.headers.referer;
        console.log(url);
        res.send({ status: 1, msg: "数据库插入成功！" });
    } else {
        res.send({ status: 0, msg: "数据库出现异常请稍后再试！" }).end();
    }
};

/**
 * 查看全部帖子
 */
exports.getTalk = async (req, res) => {
    var token = req.session.token;
    var talkList = await Talk.prototype.getTalk(req.params.classID);
    if (req.query.choice == null) choice = 0;
    else choice = req.query.choice;
    res.render("courses/talkBoard", {
        talkList: talkList,
        token: token,
        choice: choice //设置默认显示我的帖子
    });
};

/**
 * 发布帖子
 */
exports.writeTalk = async (req, res) => {
    var ret = await Talk.prototype.writeTalk(
        req.body.title,
        req.body.content,
        req.body.time
    );
    if (ret) {
        res.send({ status: 1 }).end();
    } else {
        res.send({ status: 0, msg: "数据库出现异常请稍后再试！" }).end();
    }
};

exports.addHw = async (req, res) => {
    res.render('homework/teacherHomeworkAdd');
}
/**
 * 查看帖子详情
 */
exports.showTalk = async (req, res) => {
    var token = req.session.token;
    res.render("courses/commentPage", { token: token });
};

/**
 * 评论帖子
 */
exports.addComment = async (req, res) => { };