var User = require('./User');
var pool = require('../mysql/ConnPool');
var test = async (classID, studentID) => {
    try {
        var conn = await pool.getConnection();
        var personalMarkResult = 0;
        var projectGrade;
        var retFullMark = await conn.query("select sum(fullMark) as totalScore from class_project where classID = ? group by classID", [classID]);
        var personalMark = await conn.query("select mark from class_project natural join class_project_score where studentID = ? and classID = ?", [studentID, classID]);
        console.log(retFullMark[0].length);
        console.log(personalMark[0].length);
        if (retFullMark[0].length == 0) {
            projectGrade = 100;
            return projectGrade;
        }
        
        else {
            for (var i = 0; i < personalMark[0].length; i++) {
                personalMarkResult += parseInt(personalMark[0][i].mark);
            }
            projectGrade = parseFloat(personalMarkResult * 100 / retFullMark[0][0].totalScore);
            projectGrade = (projectGrade).toFixed(2);
            return projectGrade;
        }

    }
    catch (err) {
        console.log(err);
        return null;
    }
    finally {
        conn.release();
    }
    
};

test('02', '3170100001');

