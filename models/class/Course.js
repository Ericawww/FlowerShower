var pool = require('../mysql/ConnPool');

class Course {
    
    constructor() {

    }
    /**
     * 全部课程-返回全部课程
     * @return {Array} 返回全部课程组成的JSON对象数组，否则返回空数组
     */
    async getAllCourse()
    {
        try{
            var conn = await pool.getConnection();
            var ret = await conn.query("select courseNumber,coursePhoto,description,courseName from course");
            return ret[0];
        }catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 搜索课程-利用课程名称
     * 
     * @param {string} courseName 用户输入的课程名称
     * @return {Array} 进行模糊匹配，若存在则返回符合模糊匹配的JSON对象数组，否则返回空数组
     */
    async getCourseByName(courseName) {
        try {
            var conn = await pool.getConnection();
            var courseNamePattern = "%"+courseName+"%";
            console.log(courseNamePattern);
            var ret = await conn.query("select courseNumber,coursePhoto,description,courseName from course where courseName like ? ",[courseNamePattern]);
            console.log(ret);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }
    /**
     * 筛选课程，按照开课学院
     * @param {string} courseDept 
     */
    async getCourseByCondition(courseDept){
        try{
            var conn = await pool.getConnection();
            var ret = await conn.query("select courseNumber,coursePhoto,description,courseName  from course where courseDept = ", [courseDept]);
            return ret[0];
        }catch(err)
        {
           console.log(err);
            return null;
        }finally{
            conn.close();
        }
    }

    /**
     * 课程具体信息-根据courseNumber获得课程详细信息
     * @param {*} courseNumber 网页从请求中解析得到的courseNumber
     * @return {Array}  返回courseNumber对应的课程信息，若不存在则返回null
     */
    async getCourseInfo(courseNumber) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from course where courseNumber = ? ",[courseNumber]);
            if (ret[0].length > 0) return ret[0][0];
            else return null;
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }
    
    async getCourseTeacher(courseNumber)
    {
        try{
            var conn = await pool.getConnection();
            //极其怀疑正确性
            var ret = await conn.query("select teacherID,userName,userPhoto from user inner join class on user.userID = class.teacherID where courseNumber=? ",[courseNumber]);
            //ret[0]包含满足条件的teacherID-还需要userName和userPhoto
            if (ret[0].length > 0) return ret[0];
            else return null;
        }catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }
}
module.exports = Course;