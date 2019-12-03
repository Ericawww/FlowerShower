var pool = require('../mysql/ConnPool');

class Course {
    constructor() {
    }

    async getCourseGrade(classID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from class_grade where classID = ?", [classID]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }
}


module.exports = Course;