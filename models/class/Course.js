var pool = require('../mysql/ConnPool');

class Course {

    /**
     * 新建课程
     * 
     * @param {Object} course 
     * @return {string} 返回错误信息，新建成功返回null，失败返回message
     */
    async insertCourse(course) {
        var conn = await pool.getConnection();
        try {
            var sql = "insert into course(courseNumber, courseName, coursePhoto, courseDept, credit, prerequisite, \
                description, outline) values (?, ?, ?, ?, ?, ?, ?, ?)";
            var params = [course.courseNumber, course.courseName, course.coursePhoto, course.courseDept, course.credit,
            course.prerequisite, course.description, course.outline];
            await conn.query(sql, params);
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 批量删除课程
     * 
     * @param {Array} courseList 需要删除的课程id构成的数组
     * @return {Array} 返回导入错误列表，为插入时发生错误的行的信息；数据库异常则返回null
     */
    async deleteCourses(courseList) {
        console.log(courseList);
        var conn = await pool.getConnection();
        try {
            var errList = [];
            for (let i = 0; i < courseList.length; i++) {
                try {
                    await conn.query("delete from course where courseNumber = ?", courseList[i]);
                } catch (err) {
                    errList.push({
                        index: i,
                        courseNumber: courseList[i].courseNumber,
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
     * 更新课程信息
     * 
     * @param {Object} course 
     * @return {string} 返回错误信息，新建成功返回null，失败返回message
     */
    async updateCourse(course) {
        var conn = await pool.getConnection();
        try {
            var sql = "update course set courseNumber = ";
            var params = [];
            if ('newCourseNumber' in course) {
                sql += "?";
                params.push(course.newCourseNumber);
            } else {
                sql += "courseNumber";
            }
            if ('courseName' in course) {
                sql += ", courseName = ?";
                params.push(course.courseName);
            }
            if ('coursePhoto' in course) {
                sql += ", coursePhoto = ?";
                params.push(course.coursePhoto);
            }
            if ('courseDept' in course) {
                sql += ", courseDept = ?";
                params.push(course.courseDept);
            }
            if ('credit' in course) {
                sql += ", credit = ?";
                params.push(course.credit);
            }
            if ('prerequisite' in course) {
                sql += ", prerequisite= ?";
                params.push(course.prerequisite);
            }
            if ('description' in course) {
                sql += ", description = ?";
                params.push(course.description);
            }
            if ('outline' in course) {
                sql += ", outline = ?";
                params.push(course.outline);
            }
            sql += " where courseNumber = ?";
            params.push(course.courseNumber);
            await conn.query(sql, params);
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 根据条件获取对应课程的信息
     *
     * @param {Object} conditions
     * @return {Array} 返回获取到的用户信息的数组，如果出现异常返回null
     */
    async getCourses(conditions) {
        try {
            var sql = "select * from course where 1";
            var params = [];
            if ('courseNumber' in conditions && conditions.courseNumber != "") {
                sql += " and courseNumber = ?";
                params.push(conditions.courseNumber);
            }
            if ('courseName' in conditions) {
                sql += " and courseName like ?";
                params.push('%' + conditions.courseName + '%');
            }
            if ('courseDept' in conditions) {
                sql += " and courseDept like ?";
                params.push('%' + conditions.courseDept + '%');
            }
            var conn = await pool.getConnection();
            var ret = await conn.query(sql, params);
            //console.log(sql);
            //console.log(params);
            //console.log(ret[0]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 获得一个班级的所有成绩
     * 
     * @param {string} classID
     * @return {Struct} data 包括这个班级所有学生各项成绩的数据项 
     */
    async getCourseGrade(classID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from take where classID = ?", [classID]);
            var takeTwoGrade = ret[0];
            var homeworkGrade = new Array();
            var allProject = await conn.query("select * from class_project where classID = ?", [classID]);
            var allProjectResult = allProject[0];
            var totalHomeworkMark = 0;
            if (allProjectResult.length != 0) {
                for (let i = 0; i < allProjectResult.length; i++) {
                    totalHomeworkMark += allProjectResult[i].fullMark;
                }
                var studentProjectScore = await conn.query("select studentID,sum(mark) as totalMark from class_project natural join class_project_score where classID = ? group by studentID", [classID]);
                var studentProjectScoreResult = studentProjectScore[0];
                for (let i = 0; i < takeTwoGrade.length; i++) {
                    var j;
                    for (j = 0; j < studentProjectScoreResult.length; j++) {
                        if (takeTwoGrade[i].studentID == studentProjectScoreResult[j].studentID) {
                            break;
                        }
                    }
                    if (j < studentProjectScoreResult.length) {
                        homeworkGrade[i] = (studentProjectScoreResult[j].totalMark * 100 / totalHomeworkMark).toFixed(2);
                    } else {
                        homeworkGrade[i] = 0;
                    }
                }
            } else {
                for (let i = 0; i < takeTwoGrade.length; i++) {
                    homeworkGrade[i] = 100;
                }
            }
            var data = {
                takeTwoGrade: takeTwoGrade,
                homeworkGrade: homeworkGrade
            };
            return data;
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

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

    async getCourseTeacher(courseNumber) {
        try {
            var conn = await pool.getConnection();
            //极其怀疑正确性
            var ret = await conn.query("select teacherID,userName,userPhoto from user inner join class on user.userID = class.teacherID where courseNumber=? ", [courseNumber]);
            //ret[0]包含满足条件的teacherID-还需要userName和userPhoto
            if (ret[0].length > 0) return ret[0];
            else return null;
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 更新某项成绩（平时成绩或者考试成绩）
     * 
     * @param {struct} sql 
     */
    async updateGrade(sql) {
        try {
            var ret;
            var conn = await pool.getConnection();
            if (sql.changeType == "usualGrade") {
                ret = await conn.query("update take set usualGrade = ? where classID = ? and studentID = ?",
                    [parseInt(sql.newScore), sql.classID, sql.studentID]);
            } else {
                ret = await conn.query("update take set examGrade = ? where classID = ? and studentID = ?",
                    [parseInt(sql.newScore), sql.classID, sql.studentID]);
            }
            return 1;
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 
     * @param {string} classID
     * @return {Array} ret 返回获取到的课程成绩比重的数组，如果出现异常返回null
     */
    async getGradeWeight(classID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select projectWeight,examWeight,usualWeight from class where classID = ?", [classID]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 更新各项成绩的比重
     * 
     * @param {struct} sql 
     */
    async updateGradeWeight(sql) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("update class set projectWeight = ? , examWeight = ? , usualWeight = ? where classID = ?",
                [parseInt(sql.newProjectWeight), parseInt(sql.newExamWeight), parseInt(sql.newUsualWeight), sql.classID]);
            return 1;
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 根据classID与studentID获得小组信息
     * 
     * @param {string} classID
     * @param {string}  studentID
     */
    async getGroupNumber(classID, studentID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from class_group_member natural join class_group where classID = ? and studentID = ?",
                [classID, studentID]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 根据groupNumber获得所有的成员信息
     * 
     * @param {*} groupNumber 
     */
    async getGroupMember(groupNumber) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from class_group_member  where groupID = ?", [groupNumber]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 根据studentID获得学生的信息
     * 
     * @param {string} studentID 
     */
    async getStudentInfo(studentID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from user  where userID = ?", [studentID]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 根据classID获得班级里的小组
     * 
     * @param {string} classID 
     */
    async getClassGroup(classID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from class_group where classID = ? order by groupNumber", [classID]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 根据classID获得没有组队的同学
     * 
     * @param {classID} classID 
     */
    async getLeftStudent(classID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select studentID from take where classID = ? \
            and studentID not in \
            (select studentID from class_group natural join class_group_member where classID = ?)", [classID, classID]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 获得一个组的成员的所有信息
     * 
     * @param {*} groupID 
     */
    async getGroupMemberInfo(groupID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from class_group_member join user where studentID=userID and groupID = ?",
                [groupID]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 获取某课程所有教学班
     * 
     * @param {string} courseNumber 
     * @note 如果该课程不存在则返回空数组，否则至少返回一条记录（但不包含授课教师的信息）
     */
    async getCourseClasses(courseNumber) {
        try {
            var conn = await pool.getConnection();
            var sql = "select * from course natural left outer join class as X natural left outer join \
                (select userID as teacherID, userName as teacherName from user) as Y  where courseNumber = ? order by startTime desc; ";
            var ret = await conn.query(sql, [courseNumber]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 新建教学班
     * 
     * @param {Object} classAttr
     * @return 如果无报错返回null，否则返回错误信息
     */
    async createClass(classAttr) {
        try {
            var { classID, teacherID, courseNumber, startTime, closeTime } = classAttr;
            var conn = await pool.getConnection();
            var sql = "insert into class(classID, teacherID, courseNumber, startTime, closeTime) values(?, ?, ?, ?, ?)";
            await conn.query(sql, [classID, teacherID, courseNumber, startTime, closeTime]);
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 删除教学班
     * 
     * @param {string} classID
     * @return 如果无报错返回null，否则返回错误信息
     */
    async deleteClass(classID) {
        try {
            var conn = await pool.getConnection();
            await conn.query("delete from class where classID = ?", [classID]);
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 修改教学班
     * 
     * @param {Object} classAttr
     * @return 如果无报错返回null，否则返回错误信息
     */
    async updateClass(classAttr) {
        try {
            var { teacherID, startTime, closeTime, classID } = classAttr;
            var conn = await pool.getConnection();
            var sql = "update class set teacherID = ?, startTime = ?, closeTime = ? where classID = ?";
            await conn.query(sql, [teacherID, startTime, closeTime, classID]);
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 根据groupID向group中加入新成员
     * 
     * @param {string} groupID 
     * @param {struct} addStudentIDList 
     */
    async addGroupMember(groupID, addStudentIDList, count) {
        try {
            var conn = await pool.getConnection();
            if (count == 1) {
                await conn.query("insert into class_group_member(groupID, studentID) values (?, ?)", [groupID, addStudentIDList]);
            } else {
                for (let i = 0; i < count; i++) {
                    await conn.query("insert into class_group_member(groupID, studentID) values (?, ?)", [groupID, addStudentIDList[i]]);
                }
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
     * 删除一个小组最后一个成员，需要删除这个组
     * 
     * @param {string} classID 
     * @param {string} groupID 
     * @param {string} studentID 
     */
    async deleteGroup(classID, groupID, studentID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select groupNumber from class_group where groupID = ?", [groupID]);
            var groupNumber = parseInt(ret[0][0].groupNumber);
            await conn.query("delete from class_group_member where groupID = ? and studentID = ?", [groupID, studentID]);
            await conn.query("delete from class_group where groupID = ?", [groupID]);
            await conn.query("update class_group set groupNumber = groupNumber - 1 where classID = ? and groupNumber > ?", [classID, parseInt(groupNumber)]);
            return 1;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 随机改变某个组的组长，因为组长被删除了
     * 
     * @param {string} groupID 
     * @param {string} studentID 
     */
    async changeLeader(groupID, studentID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from class_group_member where studentID != ? and groupID = ? LIMIT 1;", [studentID, groupID]);
            await conn.query("update class_group set groupLeaderID = ? where groupID = ?", [ret[0][0].studentID, groupID]);
            return 1;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 从一个小组删除一个成员
     * 
     * @param {string} groupID 
     * @param {string} studentID 
     */
    async deleteGroupMember(groupID, studentID) {
        try {
            var conn = await pool.getConnection();
            await conn.query("delete from class_group_member where groupID = ? and studentID = ?", [groupID, studentID]);
            return 1;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 改变某个组的组长
     * 
     * @param {string} groupID 
     * @param {string} studentID 
     */
    async changeGroupLeader(groupID, studentID) {
        try {
            var conn = await pool.getConnection();
            await conn.query("update class_group set groupLeaderID = ? where groupID = ?", [studentID, groupID]);
            return 1;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }
    
    /**
     * 获得下一个应该的班级序号
     * 
     * @param {string} classID 
     */
    async getNextClassOrder(classID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from class_group where classID = ? order by groupNumber DESC limit 1;", [classID]);
            if (ret[0].length == 0) {
                return 1;
            } else {
                return ret[0][0].groupNumber;
            }
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 获得下一个组的groupID
     */
    async getNextGroupID() {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from class_group order by groupID DESC limit 1;");
            if (ret[0].length == 0) {
                return 1;
            } else {
                return ret[0][0].groupID;
            }
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 添加一个新的组
     * 
     * @param {string} classID 
     * @param {string} addStudentIDList 
     * @param {string} count 
     * @param {string} nextClassOrder 
     * @param {string} nextGroupID 
     */
    async addNewGroup(classID, addStudentIDList, count, nextClassOrder, nextGroupID) {
        try {
            var conn = await pool.getConnection();
            if (count == 1) {
                await conn.query("insert into class_group(groupID, classID, groupNumber, groupLeaderID) values (?, ?, ?, ?)", [nextGroupID, classID, nextClassOrder, addStudentIDList]);
                await conn.query("insert into class_group_member(groupID, studentID) values (?, ?)", [nextGroupID, addStudentIDList]);
            } else {
                await conn.query("insert into class_group(groupID, classID, groupNumber, groupLeaderID) values (?, ?, ?, ?)", [nextGroupID, classID, nextClassOrder, addStudentIDList[0]]);
                for (let i = 0; i < count; i++) {
                    await conn.query("insert into class_group_member(groupID, studentID) values (?, ?)", [nextGroupID, addStudentIDList[i]]);
                }
            }
            return 1;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }
}

module.exports = Course;