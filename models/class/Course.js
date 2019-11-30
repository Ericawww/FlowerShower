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
            var ret = await conn.query("select * from course");
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
            var ret = await conn.query("select * from course where courseName like '%?%' ",[courseName]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 筛选课程-利用条件-似乎只有开课学院-等会再来
     * @param {*} courseNumber 
     *
    async getCourseByCondition(courseNumber){
        try{
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from user where (userID = ? or email = ?) and userPwd = ?", [userID, userID, userPwd]);
            return ret[0];
        }catch(err)
        {
           console.log(err);
            return null;
        }finally{
            conn.close();
        }
    }
    */

    /**
     * 课程具体信息-根据courseID获得课程详细信息
     * @param {*} courseID 网页从请求中解析得到的courseID
     * @return {Array}  返回courseID对应的课程信息，若不存在则返回null
     */
    async getCourseInfo(courseID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from course where courseID = ? ",[courseID]);
            if (ret[0].length > 0) return ret[0][0];
            else return null;
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }
    
}