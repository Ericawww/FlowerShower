var pool = require("../mysql/ConnPool");

class Homework {
  constructor() {}

  /**
   * 学生申诉成绩功能
   *
   * @param {String} reason 申诉原因
   * @param {String} stuID
   * @param {String} hwID
   * @return {int} 如果成功返回1，出错则返回0
   */
  async submitComplain(stuID, hwID, reason) {
    try {
      var conn = await pool.getConnection();
      var res = await conn.query(
        "update class_project_score set complainMsg = ? where classProjectID = ? and studentID = ? ",
        [reason, hwID, stuID]
      );
      return 1;
    } catch (err) {
      console.log(err);
      return 0;
    } finally {
      conn.release();
    }
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
            var res = await conn.query("update class_project_score set complainMsg = ? where classProjectID = ? and studentID = ? ", [reason, hwID,stuID]);
            if(res == 0){
                return 0;
            }else{
                return 1;
            }
        } catch (err) {
            console.log(err);
            return 0;
        } finally {
            conn.release();
        }
    }
    /**
     * 学生申诉成绩功能
     * 
     * @param {String} description 
     * @param {String} stuID
     * @param {String} hwID
     * @return {int} 如果成功返回1，出错则返回0
     */
    async submitHw(stuID,hwID,description) {
        try {
            var conn = await pool.getConnection();
            var res = await conn.query("update class_project_score set commitMsg = ?,commitTime = current_timestamp() where classProjectID = ? and studentID = ? ", [description, hwID,stuID]);
            if(res == 0){
                return 0;
            }else{
                return 1;
            }
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
     * 查询并返回该班级该学生的所有作业
     * @param {string} classID 
     * @param {string} stuID 输出批改信息
     * @return {Array} 返回获取到的作业信息列表，如果出现异常返回null
     */
    async getAllHw(classID,stuID)
    {
        try{
            var conn = await pool.getConnection();
            if(stuID !=undefined)
            {
                var ret = await conn.query("select * from class_project left outer join class_project_score on class_project.classProjectID = class_project_score.classProjectID \
                where class_project.classID = ? and (class_project_score.studentID is null or class_project_score.studentID = ?)", [classID,stuID]);
            }
            else{
                var ret = await conn.query("select * from class_project where classID = ?",[classID]);
            }
            console.log(ret[0]);
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
                 var ret = await conn.query("select * from class_project where classProjectID = ?", [hwID]);
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
    /**
     * 教师获取教学班作业中的整体信息
     * @param {string} hwID 教学班作业
     */
    async getTcHwInfo(hwID){
         try{
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from class_project join class_project_score \
            on class_project.classProjectID = class_project_score.classProjectID \
             where class_project.classProjectID = ? and  class_project_score.complainMsg is not null and class_project.closeTime > current_timestamp();",[hwID]);
            console.log(ret[0]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }
    /**
     * 删除作业
     * @param {String} hwID
     * @return {int} 正确返回1，错误返回0
     */
    async deleteHw(hwID) {
        try {
            var conn = await pool.getConnection();
            var res = await conn.query("delete from class_project where classProjectID = ? ", [hwID]);
           return 1;
        } catch (err) {
            console.log(err);
            return 0;
        } finally {
            conn.release();
        }
    }
}
module.exports = Homework;
