var pool = require('../mysql/ConnPool');

class Homework {
    
    constructor() {

    }

    /**
     * 学生申诉成绩功能（！！未添加进数据库  参数缺少课程名 学生名等）
     * 
     * @param {String} reason 申诉原因
     * @param {String} contact 学生的联系方式，可以是邮箱或电话号码
     * @return {int} 如果成功返回1，出错则返回0
     */
    async writeComplain(reason, contact) {
        try {
            var conn = await pool.getConnection();
            await conn.query("insert into msgboard(reason, contact) values(?, ?)", [reason, contact]);
            return 1;
        } catch (err) {
            console.log(err);
            return 0;
        } finally {
            conn.release();
        }
    }

    /**
     * 判断作业号是否存在，存在返回1，不存在返回null
     * @param {string} hwID 
     */
    async isExistHw(hwID){
        try{
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from class_project where classProjectID", [hwID]);
            if (ret[0].length == 0)
            {
                return null;
            }
            return 1;
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    

}