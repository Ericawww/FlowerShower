var pool = require('../mysql/ConnPool');
var User = require('../class/User');
var USER_ALL = 3;
var GENDER_ALL = 2;

class Admin extends User {

    /**
     * 根据条件获取对应用户的信息
     * 
     * @param {Object} conditions 
     * @return {Array} 返回获取到的用户信息的数组，如果出现异常返回null
     */
    async getUsers(conditions) {
        try {
            var sql = "select userID, userName, email, phoneNumber, birth, gender, userType, userIntro from user where 1 ";
            var params = [];
            if (conditions.userType != null && parseInt(conditions.userType) != USER_ALL) {
                sql += " and userType = ?";
                params.push(conditions.userType);
            }
            if (conditions.gender != null && parseInt(conditions.gender) != GENDER_ALL) {
                sql += " and gender = ?";
                params.push(conditions.gender);
            }
            if (conditions.userName != null && conditions.userName != "") {
                sql += " and userName like ?";
                params.push('%' + conditions.userName + '%');
            }
            if (conditions.phoneNumber != null && conditions.phoneNumber != "") {
                sql += " and phoneNumber like ?";
                params.push('%' + conditions.phoneNumber + '%');
            }
            if (conditions.email != null && conditions.email != "") {
                sql += " and email like ?";
                params.push('%' + conditions.email + '%');
            }
            if (conditions.startRecord != null && conditions.limit != null) {  //为了分页器的实现
                sql += " limit ?, ?";
                params.push(conditions.startRecord, conditions.limit);
            }
            //console.log(sql);
            //console.log(params);
            var conn = await pool.getConnection();
            var ret = await conn.query(sql, params);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 批量导入用户
     * 
     * @param {Array} lists
     * @return {Array} 返回导入错误列表，为插入时发生错误的行的信息；数据库异常则返回null
     */
    async importUsers(lists) {
        var conn = await pool.getConnection();
        try {
            var errList = [];
            for (let i = 0; i < lists.length; i++) {
                //console.log(lists[i]);
                var user = lists[i];
                var params = [user.userID, user.userName, user.userPwd, user.email, user.userType];
                try {
                    await conn.query("insert into user(userID, userName, userPwd, email, userType) \
                    values(?, ?, ?, ?, ?)", params);
                } catch (err) {
                    errList.push({
                        index: i,
                        userID: user.userID,
                        errMsg: err.message
                    });
                }
            }
            return errList;
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 批量删除用户
     * 
     * @param {Array} lists
     * @return {Array} 返回导入错误列表，为插入时发生错误的行的信息；数据库异常则返回null
     */
    async deleteUsers(lists) {
        var conn = await pool.getConnection();
        try {
            var errList = [];
            for (let i = 0; i < lists.length; i++) {
                try {
                    await conn.query("delete from user where userID = ?", lists[i]);
                } catch (err) {
                    errList.push({
                        index: i,
                        userID: lists[i].userID,
                        errMsg: err.message
                    });
                }
            }
            return errList;
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    async updateUser(user) {
        return await super.updateUserInfo(user);
    }

}

module.exports = Admin;