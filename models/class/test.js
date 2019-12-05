var Course = require('./Course');
var test = async () => {
    try {
        var ret = await Course.prototype.getCourseGrade('01');
        var totalNumber = ret.takeTwoGrade.length;
        var avgUsualGrade = 0;
        var avgHomeworkGrade = 0;
        var avgTestGrade = 0;
        var avgTotalGrade = 0;
        var totalStudentGrade = new Array();
        var userNameList = new Array();

        for (var i = 0; i < ret.takeTwoGrade.length; i++) {
            totalStudentGrade[i] = parseFloat(ret.takeTwoGrade[i].usualGrade) + parseFloat(ret.takeTwoGrade[i].examGrade) + parseFloat(ret.homeworkGrade[i]);
            
            totalStudentGrade[i] = (totalStudentGrade[i] / 3).toFixed(2);
            console.log(totalStudentGrade[i]);
            avgUsualGrade += ret.takeTwoGrade[i].usualGrade;
            avgHomeworkGrade += ret.homeworkGrade[i];
            avgTestGrade += ret.takeTwoGrade[i].examGrade;
            avgTotalGrade += parseFloat(totalStudentGrade[i]);
            var returnName = await Course.prototype.getStudentName(ret.takeTwoGrade[i].studentID);
            if (returnName.length == 1) {
                userNameList[i] = returnName[0].userName;
            }
            else {
                userNameList[i] = '定义错误';
            }
        }

    } catch (err) {
        console.log(err);
    }
}

test();

