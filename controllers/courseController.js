var Course = require('../models/class/Course');

exports.getUserCoursePage = async (req, res) => {
    res.render('courses/coursePage');
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

        for(var i=0;i<ret.length;i++){
            totalStudentGrade[i] = ret[i].usualGrade + ret[i].homeworkGrade + ret[i].testGrade;
            totalStudentGrade[i] = (totalStudentGrade[i]/3).toFixed(2);
            avgUsualGrade += ret[i].usualGrade;
            avgHomeworkGrade += ret[i].homeworkGrade;
            avgTestGrade += ret[i].testGrade;
            avgTotalGrade += parseFloat(totalStudentGrade[i]);
        }
        avgTotalGrade = (avgTotalGrade/totalNumber).toFixed(2);
        avgUsualGrade = (avgUsualGrade/totalNumber).toFixed(2);
        avgTestGrade = (avgTestGrade/totalNumber).toFixed(2);
        avgHomeworkGrade = (avgHomeworkGrade/totalNumber).toFixed(2);
        res.render('courses/courseGrade', {
            data:ret,
            studentTotalGrade:totalStudentGrade,
            avgUsualGrade:avgUsualGrade,
            avgHomeworkGrade:avgHomeworkGrade,
            avgTestGrade:avgTestGrade,
            avgTotalGrade:avgTotalGrade
        });
    }
}

exports.gradeChange = async (req, res) => {
    res.render('courses/courseGradeChange');
}