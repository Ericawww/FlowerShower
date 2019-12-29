var Class = require("../models/class/Classes");
var config = require("../models/statics/config");
var Homework = require("../models/class/Homework");
var Talk = require("../models/class/Talk");
var Notice = require("../models/class/Notice");
var fileHelper = require('../models/method/fileHelper');
var utils = require('../models/method/utils');
var path = require('path');

var gUser;

/**
 * 判断当前用户是该教学班中的成员
 */
exports.checkClassMember = async (req, res, next) => {
    //req.session.token = await config.getToken("T0001", "123");
    // req.session.token = await config.getToken("1111", "123");
    var ret = await Class.prototype.isClassMember(req.params.classID, req.session.token.userID);
    if (req.session.token == null || !ret) {
        res.send({ status: 0, msg: "您暂无权限访问该页面" }).end();
        return;
    }
    gUser = ret;
    next();
};

/**
 * 判断当前用户是否为教师，是则进行路由匹配，否则返回错误信息
 */
exports.checkTeacher = async (req, res, next) => {
    if (!gUser || !gUser.privilege) {
        res.send({ status: 0, msg: "您暂无权限访问该页面" }).end();
        return;
    }
    next();
};

/**
 * 判断当前用户是否为学生，是则进行路由匹配，否则返回错误信息
 */
exports.checkStudent = async (req, res, next) => {
    if (!gUser || gUser.privilege > 0) {
        res.send({ status: 0, msg: "您暂无权限访问该页面" }).end();
        return;
    }
    next();
};

/**
 * 判断当前作业号是否存在，是则进行路由匹配，否则返回错误信息
 * TODO：这里还需要判断这个作业和这个学生(和这个课程？)
 */
exports.checkHw = async (req, res, next) => {
    var hw = await Homework.prototype.isExistHw(req.params.hw);
    if (hw == 0) {
        res.send({ status: 0, msg: "该作业不存在！" }).end();
        return;
    }
    next();
};

/**
 * 得到一门课的简要信息用作页首：
 * 课程名称：courseName
 * 开课学院：courseDept
 * 开始时间：startTime
 * 结束时间：closeTime
 * 授课老师名称：userName
 */
exports.getStuMainPage = async (req, res) => {
    res.redirect('./notice');
};

/**
 * 教师课程主页
 */
exports.getTcMainPage = async (req, res) => {
    res.redirect('./notice');
};

/**
 * 得到所有作业，若不存在为null
 */
exports.getStuAllHw = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader(req.params.classID);
    var hwList = await Homework.prototype.getAllHw(req.params.classID, req.session.token.userID);
    res.render("homework/studentHomeworkListPage", { hwList: hwList, classHeader: classHeader });
};

/**
 * 作业详细信息-得到hw标识的作业详细信息-已判断存在（checkHw)。
 */
exports.getStuHwDetail = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader(req.params.classID);
    var hwInfo = await Homework.prototype.getHwInfo(req.params.hw, req.session.token.userID);
    res.render("homework/studentHomeworkDetail", { hwInfo: hwInfo, classHeader: classHeader });
};

/**
 * 作业详细信息-得到hw标识的作业详细信息-已判断存在（checkHw)。
 */
exports.getStuHwSituation = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader(req.params.classID);
    var hwInfo = await Homework.prototype.getHwInfo(req.params.hw, req.session.token.userID);
    res.render("homework/studentHomeworkSituation", {
        hwInfo: hwInfo,
        classHeader: classHeader
    });
};

/**
 * 跳转至申诉界面
 */
exports.getStuHwComplain = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader(req.params.classID);
    var hwInfo = await Homework.prototype.getHwInfo(req.params.hw, req.session.token.userID);
    res.render("homework/studentHomeworkComplain", { classHeader: classHeader, hwInfo: hwInfo });
};

/**
 * 提交申诉
 */
exports.submitComplain = async (req, res) => {
    var ret = await Homework.prototype.submitComplain(req.session.token.userID, req.params.hw, req.body.reason);
    if (ret == 0) {
        res.send({ status: 0, msg: "异常，请重试。" }).end();
    } else {
        res.send({ status: 1 }).end();
    }
};

/**
 * 提交作业 TODO：文件上传
 */
exports.submitHw = async (req, res) => {
    try {
        var ret = await fileHelper(req, "material", "studentProjects");
        var hw = await Homework.prototype.getHwInfo(req.params.hw, req.session.token.userID);
        if (hw == null) {
            try {
                utils.removeFile(path.join(__dirname, '../private/studentProjects', ret.newName));
            } catch (err) {
                console.log(err);
            }
            res.send({ status: 0, msg: '该学生对应的该作业不存在！' }).end();
        }
        ret = await Homework.prototype.submitHw(req.session.token.userID, req.params.hw, req.body.description, 'private/studentProjects/' + ret.newName);
        if (ret == 0) {
            try {
                utils.removeFile(path.join(__dirname, '../private/studentProjects', ret.newName));
            } catch (err) {
                console.log(err);
            }
            res.send({ status: 0, msg: '上传失败，请稍后再试' }).end();
        } else {
            try {
                console.log(hw.filePath);
                if (hw.filePath != null) utils.removeFile(path.join(__dirname, '../', hw.filePath));
            } catch (err) {
                console.log(err);
            }
            res.send({ status: 1 }).end();
        }
    } catch (err) {
        console.log(err);
        res.send({ status: 0, msg: err.message }).end();
    }
};

/**
 * 跳转至提交页面，需要一点信息
 */
exports.getStuHwSubmit = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader(req.params.classID);
    var hwInfo = await Homework.prototype.getHwInfo(req.params.hw, req.session.token.userID);
    res.render("homework/studentHomeworkSubmit", {
        hwInfo: hwInfo,
        classHeader: classHeader
    });
};

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
    //console.log("HwSituation:" + req.params.classID);
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
    var hwInfo = await Homework.prototype.getHwInfo(req.params.hw);
    res.render("homework/teacherHomeworkUpdate", { classHeader: classHeader, hwInfo: hwInfo });
};

/**
 * 数据库删除作业,正确返回1，错误返回0
 */
exports.deleteHw = async (req, res) => {
    var ret = await Homework.prototype.deleteHw(req.params.hw);
    if (ret == 0) {
        res.send({ status: 0, msg: "异常，请重试。" }).end();
    } else {
        res.send({ status: 1 }).end();
    }
};
/**
 * 批改作业
 */
exports.markHwPage = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader(req.params.classID);
    var data = await Homework.prototype.getGradeSituation(req.params.hw, req.params.classID);
    var hwInfo = await Homework.prototype.getHwInfo(req.params.hw);
    var stuList, classInfo;
    if (data == null) {
        stuList = null;
        classInfo = null;
    } else {
        stuList = data.stuList;
        classInfo = data.classInfo;
    }
    res.render("homework/teacherHomeworkMark", { classHeader: classHeader, stuList: stuList, classInfo: classInfo, hwInfo: hwInfo });
};
/**
 * 教师处理申诉,需要complainList和hwInfo
 */
exports.dealComplain = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader(req.params.classID);
    var data = await Homework.prototype.getGradeSituation(req.params.hw, req.params.classID);
    var hwInfo = await Homework.prototype.getHwInfo(req.params.hw);
    var stuList;
    if (data == null) {
        stuList = null;
    } else {
        stuList = data.stuList;
    }
    res.render("homework/teacherHomeworkDealComplain", { classHeader: classHeader, hwInfo: hwInfo, complainList: stuList });
};
/**
 * 教师得到提交情况
 */
exports.getSubmitSituation = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader(req.params.classID);
    var data = await Homework.prototype.getGradeSituation(req.params.hw, req.params.classID);
    var hwInfo = await Homework.prototype.getHwInfo(req.params.hw);
    var stuList, classInfo;
    if (data == null) {
        stuList = null;
        classInfo = null;
    } else {
        stuList = data.stuList;
        classInfo = data.classInfo;
    }
    res.render("homework/teacherHomeworkSubmitSituation", { classHeader: classHeader, stuList: stuList, classInfo: classInfo, hwInfo: hwInfo });
};

/**
 * 教师得到作业成绩分布,若不存在学生则为null
 */
exports.getGradeSituation = async (req, res) => {
    var classHeader = await Class.prototype.getClassHeader(req.params.classID);
    var data = await Homework.prototype.getGradeSituation(req.params.hw, req.params.classID);
    var hwInfo = await Homework.prototype.getHwInfo(req.params.hw);
    var stuList, classInfo;
    if (data == null) {
        stuList = null;
        classInfo = null;
    } else {
        stuList = data.stuList;
        classInfo = data.classInfo;
    } res.render("homework/teacherHomeworkGradeSituation", { classHeader: classHeader, stuList: stuList, classInfo: classInfo, hwInfo: hwInfo });
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
    var ret = await Notice.prototype.updataNotice(req.params.classID, req.body.title, req.body.content);
    if (ret) {
        //var url = "localhost" + req.headers.referer;
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
    var talkList, choice;
    if (req.query.choice == null) choice = 0;
    else choice = req.query.choice;
    if (choice == 0) {
        talkList = await Talk.prototype.getTalk(req.params.classID, req.session.token.userID);//显示我的帖子
    } else {
        talkList = await Talk.prototype.getTalk(req.params.classID);//显示全部帖子
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
        req.session.token.userID,
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
    var talk = await Talk.prototype.getTalk(req.params.classID, req.session.token.userID, req.params.talkID);
    var comments = await Talk.prototype.getComment(req.params.classID, req.params.talkID);
    res.render("courses/commentPage", {
        token: token,
        talk: talk,
        comments: comments
    });
};

/**
 * 删除帖子
 */
exports.deleteTalk = async (req, res) => {
    var ret = await Talk.prototype.deleteTalk(req.params.talkID);
    if (ret) {
        res.send({ status: 1 }).end();
    } else {
        res.send({ status: 0, msg: "数据库出现异常请稍后再试！" }).end();
    }
}

/**
 * 点赞
 */
exports.addLikes = async (req, res) => {
    var ret = await Talk.prototype.addLikes(
        req.params.talkID
    );
    if (ret) {
        res.send({ status: 1 }).end();
    } else {
        res.send({ status: 0, msg: "数据库出现异常请稍后再试！" }).end();
    }
}

exports.addComment = async (req, res) => {
    var ret = await Talk.prototype.addComment(req.params.classID, req.params.talkID, req.session.token.userID, req.body.content);
    if (ret) {
        res.send({ status: 1 }).end();
    } else {
        res.send({ status: 0, msg: "数据库出现异常请稍后再试！" }).end();
    }
};


/**
 * 教师增加作业
 */
exports.updateHw = async (req, res) => {
    var ret = await Homework.prototype.updateHw(req.body.projectName, req.params.classID, req.body.startTime, req.body.closeTime,
        req.body.fullMark, req.body.description, req.body.isGroupWork);
    if (ret) {
        res.send({ status: 1, msg: "数据库插入成功！" }).end();
    } else {
        res.send({ status: 0, msg: "数据库出现异常请稍后再试！" }).end();
    }

};

/**
 * 学生申诉后更新成绩，标记为已处理
 */
exports.updateScore = async (req, res) => {
    var ret = await Homework.prototype.updateScore(req.params.hw, req.body.score, req.body.stuID);
    if (ret) {
        res.send({ status: 1, msg: "数据库插入成功！" }).end();
    } else {
        res.send({ status: 0, msg: "数据库出现异常请稍后再试！" }).end();
    }
};
/**
 * 拒绝学生的申诉，标记为已处理
 */
exports.rejectComplain = async (req, res) => {
    var ret = await Homework.prototype.updateScore(req.params.hw, req.body.score, req.body.stuID);
    if (ret) {
        res.send({ status: 1, msg: "数据库插入成功！" }).end();
    } else {
        res.send({ status: 0, msg: "数据库出现异常请稍后再试！" }).end();
    }
};


/**
 * 教师增加作业
 */
exports.changeHw = async (req, res) => {
    var ret = await Homework.prototype.changeHw(req.body.projectName, req.body.startTime, req.body.closeTime, req.body.fullMark,
        req.body.description, req.body.isGroupWork, req.params.hw);
    if (ret) {
        res.send({ status: 1, msg: "数据库插入成功！" }).end();
    } else {
        res.send({ status: 0, msg: "数据库出现异常请稍后再试！" }).end();
    }
};

/**
 * 教师获取资料列表
 */
exports.getTeacherMaterialPage = async (req, res) => {
    var ret = await Class.prototype.getMaterials(req.params.classID, null);
    if (ret == null) {
        res.send("<script>alert('数据库异常，请稍后再试！');</script>").end();
        return;
    }
    res.render("courses/teacherMaterial", { materials: ret });
};

/**
 * 教师获取资料列表
 */
exports.getStudentMaterialPage = async (req, res) => {
    var ret = await Class.prototype.getMaterials(req.params.classID, null);
    if (ret == null) {
        res.send("<script>alert('数据库异常，请稍后再试！');</script>").end();
        return;
    }
    res.render("courses/studentMaterial", { materials: ret });
};

/**
 * 上传资料
 */
exports.receiveTeacherMaterial = async (req, res) => {
    try {
        var ret = await fileHelper(req, "material", "classMaterials");
        var materialID = ret.newName.split('.')[0];
        //console.log(materialID);
        var errMsg = await Class.prototype.uploadMaterial(materialID, req.params.classID, ret.originName, 'private/classMaterials/' + ret.newName,
            req.session.token.userID, req.body.classProjectID);
        if (errMsg) {
            utils.removeFile(path.join(__dirname, '../private/classMaterials', ret.newName));
            res.send({ status: 0, msg: errMsg }).end();
        } else res.send({ status: 1, newFileName: ret.newName }).end();
    } catch (err) {
        console.log(err);
        res.send({ status: 0, msg: err.message }).end();
    }
};

/**
 * 下载资料
 */
exports.downloadClassMaterial = async (req, res) => {
    //console.log(req.params.classID, req.params.classProjectID, req.params.materialID);
    //目的是确认是本教学班的学生，如果是别教学班的学生或教师，但是修改了URL，将会拒绝其访问
    var ret = await Class.prototype.getMaterials(req.params.classID, req.params.classProjectID, req.params.materialID);
    if (ret.length == 0) {
        res.send({ status: 0, msg: '您暂无权限访问' }).end();
    } else {
        res.sendFile(path.join(__dirname, '../', ret[0].path));
    }
};

/**
 * 删除资料
 */
exports.removeClassMaterial = async (req, res) => {
    var ret = await Class.prototype.getMaterials(req.params.classID, req.body.classProjectID, req.body.materialID);
    if (ret.length > 0) {
        var oldPath = ret[0].path;
        ret = await Class.prototype.deleteMaterial(req.params.classID, req.body.classProjectID, req.body.materialID);
        if (ret) {
            res.send({ status: 0, msg: ret }).end();
        } else {
            try {
                await utils.removeFile(path.join(__dirname, '../', oldPath));
                res.send({ status: 1 }).end();
            } catch (err) {
                res.send({ status: 0, msg: '该资料不存在' }).end();
            }
        }
    } else {
        res.send({ status: 0, msg: '该资料不存在' }).end();
    }
};

/**
 * 教师批改作业
 */
exports.assignMark = async (req, res) => {
    var ret = await Class.prototype.assignMark(req.params.hw, req.body.stuID, req.body.mark, req.body.content);
    if (ret) {
        res.send({ status: 1 }).end();
    } else {
        res.send({ status: 0, msg: "数据库出现异常请稍后再试！" }).end();
    }
};


/**
 * 学生下载资料
 */
exports.downloadClassMaterial = async (req, res) => {
    var ret = await Homework.prototype.getHwInfo(req.params.hw, req.session.token.userID);
    if (ret == null) {
        res.send({ status: 0, msg: '您暂无权限访问' }).end();
    } else {
        res.sendFile(path.join(__dirname, '../', ret.filePath));
    }
};
