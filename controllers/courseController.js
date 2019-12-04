var Course = require('../models/class/Course');

/**
 * 用户课程主页
 */
exports.getUserCoursePage = async (req, res) => {
    res.render('courses/coursePage');
}

/**
 * 返回所有课程
 */
exports.getAllCourse = async (req, res) => {
    var courseList = await Course.prototype.getCourses({});
    res.render('courses/search', { courseList: courseList });

}
/**
 * 返回按课程名匹配到的课程信息
 */
exports.getCourseByName = async (req, res) => {
    var courseList = await Course.prototype.getCourses({ courseName: req.query.courseName });
    res.render('courses/search', { courseList: courseList });
}

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
        res.render('courses/courseInfo', { courseInfo: courseInfo[0], teacherList: courseTeacherList });
    }
}


exports.getGrade = async (req, res) => {
    var ret = await Course.prototype.getCourseGrade('000001');
    if (ret == null) {
        alert("数据库异常！")
        res.end();
    } else if (ret.length == 0) {
        alert("还没有学生有该课程成绩录入！")
        res.end();
    } else {
        var totalNumber = ret.length;
        var avgUsualGrade = 0;
        var avgHomeworkGrade = 0;
        var avgTestGrade = 0;
        var avgTotalGrade = 0;
        var totalStudentGrade = new Array();

        for (var i = 0; i < ret.length; i++) {
            totalStudentGrade[i] = ret[i].usualGrade + ret[i].homeworkGrade + ret[i].testGrade;
            totalStudentGrade[i] = (totalStudentGrade[i] / 3).toFixed(2);
            avgUsualGrade += ret[i].usualGrade;
            avgHomeworkGrade += ret[i].homeworkGrade;
            avgTestGrade += ret[i].testGrade;
            avgTotalGrade += parseFloat(totalStudentGrade[i]);
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
            avgTotalGrade: avgTotalGrade
        });
    }
}

exports.gradeChange = async (req, res) => {
    res.render('courses/courseGradeChange');
}