var pool = require("../mysql/ConnPool");

class Classes {

    /**
     * 
     * @param {string} classID 教学班ID
     * @return {Array} 满足条件的单条记录，不满足则为null
     */
    async getClassHeader(classID) {
        try {
            var conn = await pool.getConnection();
            //console.log(classID);
            var ret = await conn.query("select course.courseName,course.courseDept,class.startTime,class.closeTime,user.userName from \
                class inner join course inner join user on class.courseNumber=course.courseNumber and user.userID = class.teacherID \
                where classID = ?", [classID]);
            //console.log(ret);
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
     * 判断用户是否属于某个课程（包括老师、助教、学生）并给出他们的用户类型和权限
     * 
     * @param {string} classID 
     * @param {string} userID
     * @return {Object} userID为用户ID, type为用户类型（0学生，1教师，2助教），privilege（掩码形式，0~15）
     */
    async isClassMember(classID, userID) {
        try {
            var conn = await pool.getConnection();
            var sql = "(select studentID as userID, 0 as type, 0 as privilege from take where classID = ? and studentID = ? limit 1) union \
                 (select teacherID as userID, 1 as type, 15 as privilege from class where classID = ? and teacherID = ? limit 1) union \
                 (select userID , 3 as type, privilege from assistant where classID = ? and userID = ? limit 1)";
            var params = [classID, userID, classID, userID, classID, userID];
            var ret = await conn.query(sql, params);
            if (ret[0].length > 0) return true;
            else return false;
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 获取教学班对应的学生信息包括成绩
     * 
     * @param {string} classID
     * @return {Array} 成功返回该教学班所有学生信息包括成绩，出错则返回null
     */
    async getClassMembers(classID) {
        try {
            var conn = await pool.getConnection();
            var sql = "select * from (select * from class_member where classID = ?) as X natural join \
                (select studentID, sum(mark) as projectScore from project_stat  where classID = ? group by studentID) as Y";
            var params = [classID, classID];
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
     * 教学班批量导入学生
     * 
     * @param {int} classID 
     * @param {Array} students 
     * @return {Array} 成功返回错误列表errList，出错则返回null
     */
    async importClassMembers(classID, students) {
        try {
            var errList = [];
            var conn = await pool.getConnection();
            for (let i = 0; i < students.length; i++) {
                try {
                    let sql = "insert into take(studentID, classID, usualGrade, examGrade) values (?, ?, ?, ?)";
                    let params = [students[i].studentID, classID, student[i].usualGrade, student[i].examGrade];
                    await conn.query(sql, params);
                } catch (err) {
                    errList.push({
                        index: i,
                        studentID: students[i].studentID,
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
     * 批量修改学生-教学班选课关系中的信息
     *
     * @param {int} classID
     * @param {Array} students
     * @return {Array} 成功返回错误列表errList，出错则返回null
     */
    async modifyClassMembers(classID, students) {
        try {
            var errList = [];
            var conn = await pool.getConnection();
            for (let i = 0; i < students.length; i++) {
                try {
                    let sql = "update take set usualGrade = ?, examGrade = ? where classID = ? and studentID = ?";
                    let params = [student[i].usualGrade, student[i].examGrade, classID, students[i].studentID];
                    await conn.query(sql, params);
                } catch (err) {
                    errList.push({
                        index: i,
                        studentID: students[i].studentID,
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
     * 批量删除学生-教学班选课关系中的信息
     *
     * @param {int} classID
     * @param {Array[int]} students
     * @return {Array} 成功返回错误列表errList，出错则返回null
     */
    async deleteClassMembers(classID, students) {
        try {
            var errList = [];
            var conn = await pool.getConnection();
            for (let i = 0; i < students.length; i++) {
                try {
                    let sql = "delete from take where classID = ? and studentID = ?";
                    let params = [classID, students[i]];
                    await conn.query(sql, params);
                    //删除该用户在教学班中的作业
                    //删除该用户在教学班中的分组信息
                    //删除该用户在教学班中的讨论、留言信息（不需要）
                    //删除该用户在教学班中的考试信息
                } catch (err) {
                    errList.push({
                        index: i,
                        studentID: students[i],
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
     * 获取该课程的分组信息
     * 
     * @param {string} classID 
     * @param {Object} conditions
     * @return {Object} eg:
     * +-----------+---------+---------+-------------+---------------+-----------------+-------------+
     * | studentID | groupID | classID | groupNumber | groupLeaderID | groupLeaderName | studentName |
     * +-----------+---------+---------+-------------+---------------+-----------------+-------------+
     * | 4444      |       1 | Class01 |           1 | 1111          | 应承峻          | 学生C        |
     * | 5555      |       1 | Class01 |           1 | 1111          | 应承峻          | 学生D        |
     * | 6666      |       1 | Class01 |           1 | 1111          | 应承峻          | 学生E        |
     * | 7777      |       1 | Class01 |           1 | 1111          | 应承峻          | 学生F        |
     * | NULL      |       2 | Class01 |           2 | 2222          | 学生A           | NULL        |
     * +-----------+---------+---------+-------------+---------------+-----------------+-------------+
     */
    async getGroups(classID) {
        try {
            var conn = await pool.getConnection();
            var sql = "select * from (select groupID, classID, groupNumber, groupLeaderID, userName as groupLeaderName \
                from class_group,user where groupLeaderID = userID) as P natural left outer join class_group_member natural left outer join \
                 (select userID as studentID, userName as studentName from user) as X where classID = ?";
            var params = [classID];
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
     * 教学班中新建一个分组
     * 
     * @param {string} classID 
     * @param {int} groupNumber 
     * @param {string} groupLeaderID 
     * @return {string} errMsg 若出错则返回出错信息，执行成功返回null
     */
    async createGroup(classID, groupNumber, groupLeaderID) {
        try {
            var conn = await pool.getConnection();
            //判断新建组的组长是否已经是本教学班某个分组的成员
            var sql = "select studentID from class_group_member where studentID = ? and groupID in \
                (select groupID from class_group where classID = ? group by groupID) ";
            var params = [groupLeaderID, classID];
            var ret = await conn.query(sql, params);
            if (ret[0].length > 0) {  //该组长已经是本教学班某个分组的成员
                throw "该组长已经是本教学班中某小组的成员！";
            } else {
                sql = "insert into class_group(classID, groupNumber, groupLeaderID) values(?, ?, ?)";
                params = [classID, groupNumber, groupLeaderID];
                ret = await conn.query(sql, params);
            }
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }


    /**
     * 删除某个分组
     * 
     * @param {string} classID
     * @param {string} groupLeaderID
     * @return {string} errMsg 若出错则返回出错信息，执行成功返回null
     */
    async deleteGroup(classID, groupLeaderID) {
        try {
            var conn = await pool.getConnection();
            await conn.query("delete from class_group where classID = ? and groupLeaderID = ?", [classID, groupLeaderID]);
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 更换组长
     * 
     * @param {string} classID
     * @param {string} groupLeaderID
     * @param {string} newGroupLeaderID
     * @return {string} errMsg 若出错则返回出错信息，执行成功返回null
     */
    async updateGroupLeader(classID, groupLeaderID, newGroupLeaderID) {
        try {
            var conn = await pool.getConnection();
            //相同教学班的不同分组的组长肯定不会重复，但是还是需要判断要替换的组长是否已经是某个组的组员
            var sql = "select studentID from class_group_view where classID = ? and studentID = ?;"
            var params = [classID, newGroupLeaderID];
            var ret = await conn.query(sql, params);
            if (ret[0].length > 0) throw "该学生（新组长）已经在教学班的某分组中！";
            await conn.query("update class_group set groupLeaderID = ? where classID = ? and groupLeaderID = ?", [newGroupLeaderID, classID, groupLeaderID]);
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 向分组中添加一名学生
     * 
     * @param {string} classID
     * @param {int} groupNumber
     * @param {string} studentID
     */
    async insertStudentToGroup(classID, groupNumber, studentID) {
        try {
            var conn = await pool.getConnection();
            //判断该学生是否已经在教学班中的某个分组中存在
            var sql = "select studentID from class_group_view where classID = ? and (studentID = ? or groupLeaderID = ?);"
            var params = [classID, studentID, studentID];
            var ret = await conn.query(sql, params);
            if (ret[0].length > 0) throw "该学生已经在教学班的某分组中！";
            await conn.query("insert into class_group_member(groupID, studentID) values( \
                (select groupID from class_group where classID = ? and groupNumber = ?), ?)", [classID, groupNumber, studentID]);
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 从分组中删除一名学生
     * 
     * @param {string} classID
     * @param {string} studentID
     */
    async removeStudentFromGroup(classID, studentID) {
        try {
            var conn = await pool.getConnection();
            await conn.query("delete from class_group_member where studentID = ? and groupID in \
                (select groupID from class_group where classID = ?);", [classID, studentID]);
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 上传资料
     * 
     * @param {string} classID
     * @param {int} chapterNumber
     * @param {string} path
     * @param {string} submitterID
     */
    async uploadMaterial(classID, materialName, path, submitterID) {
        try {
            var conn = await pool.getConnection();
            await conn.query("insert into class_materials(classID, materialName, path, submitter, uploadTime) values \
                (?, ?, ?, ?, CURRENT_TIMESTAMP);", [classID, materialName, path, submitterID]);
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 删除资料
     * 
     * @param {string} classID
     * @param {int} chapterNumber 
     * @param {string} path
     */
    async deleteMaterial(classID, path) {
        try {
            var conn = await pool.getConnection();
            await conn.query("delete from class_materials where classID = ? and path = ?;", [classID, path]);
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

}

module.exports = Classes;
