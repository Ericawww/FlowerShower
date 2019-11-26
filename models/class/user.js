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
     * 获取用户信息
     *
     * @param {int} userID 用户ID或者邮箱
     * @return {Array} 如果验证通过，则返回包含用户信息的JSON对象数组，否则返回null
     */
    async getUserInfo(userID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from user where (userID = ? or email = ?)", [userID, userID]);
            if (ret[0].length > 0) return ret[0][0];
            else return null;
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 修改用户信息
     * 
     * @param {Object} user 
     * @return {Array} 返回该用户修改后的信息, null对应不存在这个用户
     */
    async updateUserInfo(user) {
        try {
            var conn = await pool.getConnection();
            var sql = "update user set userID = userID";
            var params = [];
            if (user.userName != undefined) {
                sql += ", userName = ?";
                params.push(user.userName);
            }
            if (user.userPwd != undefined) {
                sql += ", userPwd = ?";
                params.push(user.userPwd);
            }
            if (user.email != undefined) {
                sql += ", email = ?";
                params.push(user.email);
            }
            if (user.phoneNumber != undefined) {
                sql += ", phoneNumber = ?";
                params.push(user.phoneNumber);
            }
            if (user.gender != undefined) {
                sql += ", gender = ?";
                params.push(user.gender);
            }
            if (user.birth != undefined) {
                sql += ", birth = ?";
                params.push(user.birth);
            }
            if (user.userPhoto != undefined) {
                sql += ", userPhoto = ?";
                params.push(user.userPhoto);
            }
            if (user.userIntro != undefined) {
                sql += ", userIntro = ?";
                params.push(user.userIntro);
            }
            if (user.userType != undefined) {
                sql += ", userType = ?";
                params.push(user.userType);
            }
            sql += " where userID = ?";
            params.push(user.userID);
            await conn.query(sql, params);
            return await this.getUserInfo(user.userID)
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

    /**
     * 重置密码
     * 
     * @param {string} email 用户邮箱
     * @param {string} newPwd 新密码
     * @return 重置成功返回1，失败返回0
     */
    async reset(email, newPwd) {
        try {
            var conn = await pool.getConnection();
            await conn.query("update user set userPwd = ? where email = ?", [newPwd, email]);
            return 1;
        } catch (err) {
            console.log(err);
            return 0;
        } finally {
            conn.release();
        }
    }

    /**
     * 修改用户照片路径
     * 
     * @param {string} userID 用户ID
     * @param {string} newPath 新路径
     * @return 修改成功返回1，失败返回0
     */
    async updatePhotoSrc(userID, newPath) {
        try {
            var conn = await pool.getConnection();
            await conn.query("update user set userPhoto = ? where userID = ?", [newPath, userID]);
            return 1;
        } catch (err) {
            console.log(err);
            return 0;
        } finally {
            conn.release();
        }
    }

}

module.exports = User;