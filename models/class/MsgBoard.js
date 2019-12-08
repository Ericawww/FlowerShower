var pool = require('../mysql/ConnPool');

class MsgBoard {
    
    constructor() {

    }

    /**
     * 用户留言功能
     * 
     * @param {String} content 留言内容
     * @param {String} contact 用户的联系方式，可以是邮箱或电话号码
     * @return {int} 如果成功返回1，出错则返回0
     */
    async writeMsg(content, contact) {
        try {
            var conn = await pool.getConnection();
            await conn.query("insert into msgboard(content, contact) values(?, ?)", [content, contact]);
            return 1;
        }
        catch (err) {
            console.log(err);
            return 0;
        }
        finally {
            conn.release();
        }
    }


}

module.exports = MsgBoard;