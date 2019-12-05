var Course = require('./Course');
var test = async () => {
    try {
        var ret = await Course.prototype.getCourseGrade('01');
        var gradeWeight = await Course.prototype.getGradeWeight('01');
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
            }
            else {
                userNameList[i] = '定义错误';
            }
            console.log(totalStudentGrade[i]);
        }
        avgTotalGrade = (avgTotalGrade / totalNumber).toFixed(2);
        avgUsualGrade = (avgUsualGrade / totalNumber).toFixed(2);
        avgTestGrade = (avgTestGrade / totalNumber).toFixed(2);
        avgHomeworkGrade = (avgHomeworkGrade / totalNumber).toFixed(2);
        

    } catch (err) {
        console.log(err);
    }
}

test();

