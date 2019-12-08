var Course = require("../models/class/Course");
var Talk = require("../models/class/Talk");

/**
 * 返回所有课程
 */
exports.getAllCourse = async (req, res) => {
    var courseList = await Course.prototype.getCourses({});
    res.render("courses/search", { courseList: courseList });
};

/**
 * 返回按课程名匹配到的课程信息
 */
exports.getCourseByName = async (req, res) => {
    var courseList = await Course.prototype.getCourses({
        courseName: req.query.courseName
    });
    res.render("courses/search", { courseList: courseList });
};

/**
 * 返回courseNumber标识的唯一课程的信息，不存在则弹窗，存在则跳转
 */
exports.getCourseInfo = async (req, res) => {
    var courseInfo = await Course.prototype.getCourses({ courseNumber: req.params.courseNumber });
    if (courseInfo.length == 0) {
        res.send({ status: 0, msg: "该课程不存在，请检查课程号正确性！" }).end();
    } else {
        var replaceRegex = /(\n\r|\r\n|\r|\n)/g;
        if (courseInfo[0].outline != null) {
            courseInfo[0].outline = courseInfo[0].outline.replace(replaceRegex, "<br>");
        }
        var courseTeacherList = await Course.prototype.getCourseTeacher(req.params.courseNumber);
        res.render("courses/courseInfo", {
            courseInfo: courseInfo[0],
            teacherList: courseTeacherList
        });
    }
};

/**
 * 新版班级成绩查看
 */
exports.getGrade = async (req, res) => {
    var getClassID = req.params.classID;
    var ret = await Course.prototype.getCourseGrade(getClassID);
    if (ret == null) {
        console.log("数据库异常！");
        res.end();
    } else if (ret.takeTwoGrade.length == 0) {
        console.log("还没有学生有该课程成绩录入！");
        res.end();
    } else {
        var gradeWeight = await Course.prototype.getGradeWeight(getClassID);
        var totalNumber = ret.takeTwoGrade.length;
        var avgUsualGrade = 0;
        var avgHomeworkGrade = 0;
        var avgTestGrade = 0;
        var avgTotalGrade = 0;
        var totalStudentGrade = new Array();
        var userNameList = new Array();

        for (var i = 0; i < ret.takeTwoGrade.length; i++) {
            totalStudentGrade[i] = parseFloat(ret.takeTwoGrade[i].usualGrade) * parseFloat(gradeWeight[0].usualWeight) / 100
                + parseFloat(ret.takeTwoGrade[i].examGrade) * parseFloat(gradeWeight[0].examWeight) / 100
                + parseFloat(ret.homeworkGrade[i]) * parseFloat(gradeWeight[0].projectWeight) / 100;
            totalStudentGrade[i] = (totalStudentGrade[i]).toFixed(2);
            avgUsualGrade += ret.takeTwoGrade[i].usualGrade;
            avgHomeworkGrade += parseFloat(ret.homeworkGrade[i]);
            avgTestGrade += ret.takeTwoGrade[i].examGrade;
            avgTotalGrade += parseFloat(totalStudentGrade[i]);
            var returnName = await Course.prototype.getStudentName(ret.takeTwoGrade[i].studentID);
            if (returnName.length == 1) {
                userNameList[i] = returnName[0].userName;
            } else {
                userNameList[i] = '定义错误';
            }
        }
        avgTotalGrade = (avgTotalGrade / totalNumber).toFixed(2);
        avgUsualGrade = (avgUsualGrade / totalNumber).toFixed(2);
        avgTestGrade = (avgTestGrade / totalNumber).toFixed(2);
        avgHomeworkGrade = (avgHomeworkGrade / totalNumber).toFixed(2);
        res.render('courses/courseGrade', {
            data: ret,
            studentTotalGrade: totalStudentGrade,
            avgUsualGrade: avgUsualGrade,
            avgHomeworkGrade: avgHomeworkGrade,
            avgTestGrade: avgTestGrade,
            avgTotalGrade: avgTotalGrade,
            userNameList: userNameList
        });
    }
};


/**
 * 班级成绩修改的查找
 */
exports.gradeChange = async (req, res) => {
    var ret = await Course.prototype.getCourseGrade(req.params.classID);
    if (ret == null) {
        console.log("数据库异常！");
        res.end();
    } else if (ret.length == 0) {
        console.log("还没有学生有该课程成绩录入！");
        res.end();
    } else {
        var gradeWeight = await Course.prototype.getGradeWeight(req.params.classID);
        //var totalNumber = ret.takeTwoGrade.length;
        var totalStudentGrade = new Array();
        var userNameList = new Array();

        for (var i = 0; i < ret.takeTwoGrade.length; i++) {
            totalStudentGrade[i] = parseFloat(ret.takeTwoGrade[i].usualGrade) * parseFloat(gradeWeight[0].usualWeight) / 100
                + parseFloat(ret.takeTwoGrade[i].examGrade) * parseFloat(gradeWeight[0].examWeight) / 100
                + parseFloat(ret.homeworkGrade[i]) * parseFloat(gradeWeight[0].projectWeight) / 100;
            totalStudentGrade[i] = (totalStudentGrade[i]).toFixed(2);
            var returnName = await Course.prototype.getStudentName(ret.takeTwoGrade[i].studentID);
            if (returnName.length == 1) {
                userNameList[i] = returnName[0].userName;
            } else {
                userNameList[i] = '定义错误';
            }
        }
        res.render('courses/courseGradeChange', {
            data: ret,
            studentTotalGrade: totalStudentGrade,
            userNameList: userNameList,
            gradeWeight: gradeWeight[0]
        });
    }
};

/**
 * 新版成绩修改，作业成绩无法修改，作业成绩的修改只能通过每个project成绩的修改来达成
 */
exports.setGradeChange = async (req, res) => {
    var sql = {
        classID: req.params.classID,
        studentID: req.body.studentID,
        changeType: req.body.changeItem,
        newScore: req.body.newScore
    };
    var ret = await Course.prototype.updateGrade(sql);

    if (ret == 1) {
        res.send({ status: 1 }).end();
    } else {
        res.send({ status: 0 }).end();
    }
};

/**
 * 各项成绩比重修改
 */
exports.setGradeWeightChange = async (req, res) => {
    var sql = {
        classID: req.params.classID,
        newUsualWeight: req.body.newUsualWeight,
        newProjectWeight: req.body.newProjectWeight,
        newExamWeight: req.body.newExamWeight
    };
    var ret = await Course.prototype.updateGradeWeight(sql);
    if (ret == 1) {
        res.send({ status: 1 }).end();
    } else {
        res.send({ status: 0 }).end();
    }
};

/**
 * 学生获得自己某门课程的组队信息
 */
exports.getGroupInfo = async (req, res) => {
    var studentID = req.session.token.userID;
    var classID = req.params.classID;
    var ret = await Course.prototype.getGroupNumber(classID, studentID);
    var groupMember;
    var studentInfoList = new Array();
    var result = 0;
    if (ret.length != 0) {
        groupMember = await Course.prototype.getGroupMember(ret[0].groupNumber);
        for (var i = 0; i < groupMember.length; i++) {
            studentInfoList[i] = await Course.prototype.getStudentInfo(groupMember[i].studentID);
        }
        result = 1;
    }
    res.render('courses/studentGroupInfo', {
        ret: ret,
        studentInfoList: studentInfoList,
        result: result
    });
};

/**
 * 老师进行课程的组队管理
 */
exports.groupOperation = async (req, res) => {
    var classID = req.params.classID;
    var classGroup = await Course.prototype.getClassGroup(classID);
    var leftStudentList = await Course.prototype.getLeftStudent(classID);
    var leftStudentInfoList = new Array();
    var classGroupInfoList = new Array();
    if (leftStudentList.length > 0) {
        for (let i = 0; i < leftStudentList.length; i++) {
            leftStudentInfoList[i] = await Course.prototype.getStudentInfo(leftStudentList[i].studentID);
        }
    }
    if (classGroup.length > 0) {
        for (let i = 0; i < classGroup.length; i++) {
            classGroupInfoList[i] = await Course.prototype.getGroupMemberInfo(classGroup[i].groupID);
        }
    }
    res.render('courses/teacherGroupOperation', {
        leftStudentInfoList: leftStudentInfoList,
        classGroupInfoList: classGroupInfoList,
        classGroup: classGroup
    });
};

exports.addGroupMember = async (req, res) => {
    var groupID = req.body.groupID;
    var addStudentIDList = req.body.addStudentIDList;
    var count = req.body.count;
    var ret = await Course.prototype.addGroupMember(groupID, addStudentIDList, count);
    if (ret == 1) {
        res.send({ status: 1 }).end();
    } else {
        res.send({ status: 0 }).end();
    }
};

