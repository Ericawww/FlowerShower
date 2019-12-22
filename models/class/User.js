var pool = require('../mysql/ConnPool');
var utils = require('../method/utils');

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
                //console.log(user.birth);
                //console.log(utils.isYMDDate(user.birth));
                user.birth = utils.isYMDDate(user.birth) == true ? user.birth : null;
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
            return await this.getUserInfo(user.userID);
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

    /**
     * 用户获得自己的两项成绩
     * 
     * @param {string} studentID 
     */
    async getTwoGrade(studentID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from take where studentID = ?", [studentID]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return 0;
        } finally {
            conn.release();
        }
    }

    /**
     * 用户计算总成绩需要获取各项成绩的比重
     * 
     * @param {string} classID 
     */
    async getGradeWeight(classID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select projectWeight,examWeight,usualWeight,courseNumber from class where classID = ?", [classID]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 用户姓名获取
     * 
     * @param {string} studentID 
     */
    async getStudentName(studentID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select userName from user where userID = ?", [studentID]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 用户作业成绩计算
     * 
     * @param {string} studentID 
     * @param {string} classID 
     */
    async getProjectGrade(studentID, classID) {
        try {
            var conn = await pool.getConnection();
            var personalMarkResult = 0;
            var projectGrade;
            var retFullMark = await conn.query("select sum(fullMark) as totalScore from class_project where classID = ? group by classID", [classID]);
            var personalMark = await conn.query("select mark from class_project natural join class_project_score where studentID = ? and classID = ?", [studentID, classID]);
            if (retFullMark[0].length == 0) {
                projectGrade = 100;
                return projectGrade;
            } else {
                for (var i = 0; i < personalMark[0].length; i++) {
                    personalMarkResult += parseInt(personalMark[0][i].mark);
                }
                projectGrade = parseFloat(personalMarkResult * 100 / retFullMark[0][0].totalScore);
                projectGrade = (projectGrade).toFixed(2);
                return projectGrade;
            }

        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 获取课程的名称
     * 
     * @param {string} courseNumber 
     */
    async getCourseName(courseNumber) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select courseName from course where courseNumber = ?", [courseNumber]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 根据studentID获得所有课程
     * 
     * @param {string} studentID
     */
    async getCourseNumber(studentID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select courseNumber,classID from take natural join class where studentID = ?", [studentID]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 根据courseNumber返回课程信息
     * 
     * @param {string} courseNumber
     */
    async getCourseInfo(courseNumber) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from course where courseNumber = ?", [courseNumber]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 根据courseNumber获得最新通知
     * 
     * @param {string} courseNumber 
     */
    async getCourseNotice(courseNumber){
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select title,content from notice where courseID= ? order by time DESC limit 1", [courseNumber]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 根据courseNumber得到最早交的作业
     * 
     * @param {string} classID
     */
    async getClassProject(classID){
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select description,closeTime from class_project where classID= ? order by closeTime limit 1;", [classID]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    async getMyCourseNumber(userID){
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select classID,courseNumber from class where teacherID = ?", [userID]);
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