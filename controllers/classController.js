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
    req.session.token = await config.getToken('T0001', '123');
    console.log(req.session.token);
    if (req.session.token == null || req.session.token.userType != config.TYPE_TEACHER) {
        res.send({ status: 0, msg: "您暂无权限访问该页面" }).end();
        return;
    }
    next();
}
/**
 * 判断当前用户是否为学生，是则进行路由匹配，否则返回错误信息
 * 
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
 * TODO：这里还需要判断这个作业和这个学生(和这个课程？)
 */
exports.checkHw = async (req, res, next) => {
    var hw = await Homework.prototype.isExistHw({ hwID: req.params.hw });
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
    //dev---fake session
    req.session.token = await config.getToken('9999', '123');
    var classHeader = await Class.prototype.getClassHeader(req.params.classID);
    var hwList = await Homework.prototype.getAllHw(req.params.classID, req.session.token.userID);

    res.render('homework/studentHomeworkListPage', { hwList: hwList, classHeader: classHeader });
}

/**
 * 作业详细信息-得到hw标识的作业详细信息-已判断存在（checkHw)。
 */
exports.getStuHwDetail = async (req, res) => {
    //dev---fake session
    req.session.token = await config.getToken('9999', '123');
    var classHeader = await Class.prototype.getClassHeader({ classID: req.params.classID });
    var hwInfo = await Homework.prototype.getHwInfo(req.params.hw, req.session.token.userID);
    res.render('homework/studentHomeworkDetail', { hwInfo: hwInfo, classHeader: classHeader });
}

/**
 * 作业详细信息-得到hw标识的作业详细信息-已判断存在（checkHw)。
 * 
 */
exports.getStuHwSituation = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader({ classID: req.params.classID });
    var hwInfo = await Homework.prototype.getHwInfo(req.params.hw);
    res.render('homework/studentHomeworkSituation', { hwInfo: hwInfo, classHeader: classHeader });
}

/**
 * 跳转至申诉界面，上传暂时不会，要用两次路由匹配？
 */
exports.getStuHwComplain = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader({ classID: req.params.classID });
    //插入该条complain数据，似乎也没啥好验证的
    //dev----
    req.session.token = await config.getToken('9999', '123');
    var hwInfo = await Homework.prototype.getHwInfo(req.params.hw, req.session.token.userID);
    res.render("homework/studentHomeworkComplain", { classHeader: classHeader, hwInfo: hwInfo });
};

/**
 * 提交申诉
 */
exports.submitComplain = async (req, res) => {
    //插入该条complain数据，似乎也没啥好验证的
    //dev----
    req.session.token = await config.getToken('9999', '123');
    var ret = await Homework.prototype.submitComplain(req.session.token.userID, req.params.hw, req.body.reason);
    if (ret == 0) {
        res.send({ status: 0, msg: "异常，请重试。" }).end();
    } else {
        res.send({ status: 1 }).end();
    }
};
exports.submitHw = async (req, res) => {
    //插入该条complain数据，似乎也没啥好验证的
    //dev----
    req.session.token = await config.getToken('9999', '123');
    var ret = await Homework.prototype.submitHw(req.session.token.userID, req.params.hw, req.body.description);
    if (ret == 0) {
        res.send({ status: 0, msg: "异常，请重试。" }).end();
    } else {
        res.send({ status: 1 }).end();
    }
};
/**
 * 跳转至提交页面，需要一点信息
 */
exports.getStuHwSubmit = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader({ classID: req.params.classID });
    req.session.token = await config.getToken('9999', '123');
    var hwInfo = await Homework.prototype.getHwInfo(req.params.hw);
    res.render('homework/studentHomeworkSubmit', { hwInfo: hwInfo, classHeader: classHeader });
}

//教师作业
/**
 * 教师得到当前所有班级的作业
 */
exports.getTcAllHw = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader(req.params.classID);
    var hwList = await Homework.prototype.getAllHw(req.params.classID);
    res.render("homework/teacherHomeworkListPage", { classHeader: classHeader, hwList: hwList });
};

/**
 * 教师得到选定作业的详细完成/批改/申诉情况
 */
exports.getTcHwDetail = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader(req.params.classID);
    var hwInfo = await Homework.prototype.getHwInfo(req.params.hw);
    res.render("homework/teacherHomeworkDetail", { classHeader: classHeader, hwInfo: hwInfo });
};

/**
 * 教师跳转到添加作业的页面
 */
exports.addHw = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader(req.params.classID);
    res.render("homework/teacherHomeworkAdd", { classHeader: classHeader });
};

/**
 * 教师跳转到更新作业的页面
 */
exports.updateHwPage = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader(req.params.classID);
    res.render("homework/teacherHomeworkUpdate", { classHeader: classHeader });
};

/**
 * 数据库删除作业,正确返回1，错误返回0
 */
exports.deleteHw = async(req,res)=>{
    var ret = await Homework.prototype.deleteHw(req.params.hw);
    if (ret == 0) {
        res.send({ status: 0, msg: "异常，请重试。" }).end();
    } else {
        res.send({ status: 1 }).end();
    }
}
/**
 * 批改作业
 */
exports.markHwPage = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader(req.params.classID);
    res.render("homework/teacherHomeworkMark", { classHeader: classHeader });
};
/**
 * 教师处理申诉
 */
exports.dealComplain = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader(req.params.classID);
    var hwList = await Homework.prototype.getTcHwInfo(req.params.hw);
    res.render("homework/teacherHomeworkDealComplain", { classHeader: classHeader, hwList: hwList });
}
/**
 * 教师得到提交情况
 */
exports.getSubmitSituation = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader(req.params.classID);
    var hwList = await Homework.prototype.getTcHwInfo(req.params.hw);
    res.render("homework/teacherHomeworkSubmitSituation", { classHeader: classHeader, hwList: hwList });
}

/**
 * 教师得到作业成绩分布
 */
exports.getGradeSituation = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader(req.params.classID);
    var hwList = await Homework.prototype.getTcHwInfo(req.params.hw);
    res.render("homework/teacherHomeworkGradeSituation", { classHeader: classHeader, hwList: hwList });
}


/**
 * 获得进入通知页面，获得通知
 */
exports.getCourseNotice = async (req, res) => {

    //dev---fake session
    req.session.token = await config.getToken('9999', '123');
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
    var talkList;
    if (req.query.choice == null) choice = 0;
    else choice = req.query.choice;
    if (choice == 0) {
        //显示我的帖子
        talkList = await Talk.prototype.getTalk(
            req.params.classID,
            1 //req.session.token.userID
        );
    } else {
        //显示全部帖子
        talkList = await Talk.prototype.getTalk(req.params.classID);
    }
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
        req.params.classID,
        1, //req.session.token.userID,
        req.body.title,
        req.body.content
    );
    if (ret) {
        res.send({ status: 1 }).end();
    } else {
        res.send({ status: 0, msg: "数据库出现异常请稍后再试！" }).end();
    }
};

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
