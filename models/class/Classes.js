var pool = require('../mysql/ConnPool');

class Classes {

    /**
     * 
     * @param {string} classID 教学班ID
     * @param {Array} attr 附加属性, 取值可以是''
     * @return {Object} 结果集
     */
    async getClassDetail(classID, attr) {

    }
    /**
     * 
     * @param {string} classID 教学班ID
     * @return {Array} 满足条件的单条记录，不满足则为null
     */
    async getClassHeader(classID)
    {
        try {
            var conn = await pool.getConnection();
            console.log(classID);
            var ret = await conn.query("select course.courseName,course.courseDept,class.startTime,class.closeTime,user.userName from class inner join course inner join user on class.courseNumber=course.courseNumber and user.userID = class.teacherID where classID = ?",[classID]);
            console.log(ret);
            if (ret[0].length > 0) return ret[0][0];
            else return null;
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }
    async setClassDetail() {

    }

    /**
     * 判断用户是否属于某个课程
     * 
     * @param {string} classID 
     * @param {string} studentID
     */
    async isClassMember(classID, studentID) {
        try {
            var conn = await pool.getConnection();
            var sql = "select * from take where classID = ? and studentID = ? limit 1";
            var params = [classID, studentID];
            var ret = await conn.query(sql, params);
            if (ret[0].length > 0) return true;
            else return false;
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 获取教学班对应的学生信息包括成绩（也可以用于判断学生是否处于某一个教学班中）
     * 
     * @param {string} classID
     * @param {Object} conditions
     */
    async getClassMembers(classID, conditions) {
        try {
            var conn = await pool.getConnection();
            //var sql = "select * from (select * from class_member) as X, (select ) ";
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    async importClassMembers(classID, students) {

    }

    async deleteClassMembers(classID, students) {

    }

    async getGroups() {
        
    }

    async createGroup() {

    }

    async deleteGroup() {

    }

    async insertStudentToGroup() {

    }

    async removeStudentFromGroup() {

    }

}

module.exports = Classes;