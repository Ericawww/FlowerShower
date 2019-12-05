var pool = require('../mysql/ConnPool');

class Homework {
    
    constructor() {

    }

    /**
     * 学生申诉成绩功能
     * 
     * @param {String} reason 申诉原因
     * @param {String} stuID
     * @param {String} hwID
     * @return {int} 如果成功返回1，出错则返回0
     */
    async submitComplain(stuID,hwID,reason) {
        try {
            var conn = await pool.getConnection();
            console.log(reason,contact);
            var res = await conn.query("update class_project_score set complainMsg = ? where classProjectID = ? and studentID = ? ", [reason, hwID,stuID]);
           return 1;
        } catch (err) {
            console.log(err);
            return 0;
        } finally {
            conn.release();
        }
    }

    /**
     * 判断作业号是否存在，存在返回1，不存在返回0
     * @param {string} hwID 
     * @return {int} 如果成功返回1，出错则返回0
     */
    async isExistHw(hwID){
        try{
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from class_project where classProjectID = ?", [hwID]);
            if (ret[0].length == 0)
            {
                return 0;
            }
            return 1;
        } catch (err) {
            console.log(err);
            return 0;
        } finally {
            conn.release();
        }
    }

    /**
     * 查询并返回该班级学生的所有作业
     * @param {string} classID 
     * @return {Array} 返回获取到的作业信息列表，如果出现异常返回null
     */
    async getAllHw(classID)
    {
        try{
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from class_project where classID = ?", [classID]);
            if (ret[0].length == 0)
            {
                return null;
            }
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }
    /**
     * 得到作业的详细信息，
     * @param {string} hwID
     * @param {string} stuID
     * @return {Array} 返回作业的详细信息,出错为null-返回的是一条记录
     */
    async getHwInfo(hwID,stuID)
    {
        try{
            var conn = await pool.getConnection();
            console.log(stuID);
            if(stuID != undefined){
            //需要注意：未提交过的作业不存在与class_project_score，此时相关的列的值均为NULL，列名均为
                var params = [hwID,stuID];
                var sql="select * from class_project left outer join class_project_score on class_project.classProjectID = class_project_score.classProjectID \
                where class_project.classProjectID = ? and (class_project_score.studentID is null or class_project_score.studentID = ?)";
                var ret = await conn.query(sql,params);
            }
            else{
                 var ret = await conn.query("select * from class_project left outer join class_project_score on class_project.classProjectID = class_project_score.classProjectID where class_project.classProjectID = ?", [hwID]);
            }
           console.log(ret[0][0]);//TEST：看下null到底显示成了啥
         return ret[0][0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }
}
module.exports = Homework;