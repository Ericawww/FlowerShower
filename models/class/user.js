var pool = require('../mysql/ConnPool');

class User {

    constructor() {

    }

    /**
     * 用户身份校验
     * 
     * @param {int} userID 用户ID或者邮箱
     * @param {int} userPwd 用户密码
     * @return {Array} 如果验证通过，则返回包含用户信息的JSON对象数组，否则返回空数组
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

    /**
     * 用户注册
     * 
     * @param {Object} user 
     * @return {int} 如果注册成功则返回1，如果邮箱已经存在则返回0
     */
    async regist(user) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from user where email = ?", [user.email]);
            if (ret[0].length == 0) {
                user.userID = "guest_" + new Date().getTime();
                console.log(user.userID);
                var params = [user.userID, user.userName, user.userPwd, user.email, user.phoneNumber];
                await conn.query("insert into user(userID, userName, userPwd, email, phoneNumber) \
                    values(?, ?, ?, ?, ?)", params);
                return 1;
            } else return 0;            
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

}

module.exports = User;