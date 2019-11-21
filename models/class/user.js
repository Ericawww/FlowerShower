var pool = require('../mysql/ConnPool');

class User {

    constructor() {

    }

    /**
     * 用户身份校验
     * 
     * @param {int} userID 用户ID或者邮箱
     * @param {int} userPwd 用户密码
     * @param {Array} 如果验证通过，则返回包含用户信息的JSON对象数组，否则返回空数组
     */
    async login(userID, userPwd) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from user where (userID = ? or email = ?) and userPwd = ?", [userID, userID, userPwd]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

}

module.exports = User;