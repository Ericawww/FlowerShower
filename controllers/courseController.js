var Course = require('../models/class/Course');

exports.getUserCoursePage = async (req, res) => {
    res.render('courses/coursePage');
}

/**
 * 返回所有课程
 */
exports.getAllCourse = async (req, res) => {
    var courseList = await Course.prototype.getAllCourse();
    res.render('courses/search',{courseList:courseList});
    
}
/**
 * 返回按课程名匹配到的课程信息
 */
exports.getCourseByName = async (req, res) => {
    var courseList = await Course.prototype.getCourseByName(req.params.courseName);
    res.render('courses/courseInfo',{courseList:courseList});
}

/**
 * 返回courseNumber标识的唯一课程的信息，不存在则弹窗，存在则跳转
 */
exports.getCourseInfo = async (req, res) => {
    var courseInfo=await Course.prototype.getCourseInfo(req.params.courseNumber);
    if (courseInfo == null) {
        res.send({ status: 0, msg: "该课程不存在，请检查课程号正确性！" }).end();
    } else {
        res.render('courses/courseInfo',{courseInfo:courseInfo});
    }
}