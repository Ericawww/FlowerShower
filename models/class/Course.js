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
                for (var i = 0; i < allProjectResult.length; i++) {
                    totalHomeworkMark += allProjectResult[i].fullMark;
                }
                var studentProjectScore = await conn.query("select studentID,sum(mark) as totalMark from class_project natural join class_project_score where classID = ? group by studentID", [classID]);
                var studentProjectScoreResult = studentProjectScore[0];
                for (var i = 0; i < takeTwoGrade.length; i++) {
                    var j;
                    for (j = 0; j < studentProjectScoreResult.length; j++) {
                        if (takeTwoGrade[i].studentID == studentProjectScoreResult[j].studentID) {
                            break;
                        }
                    }
                    if (j < studentProjectScoreResult.length) {
                        homeworkGrade[i] = (studentProjectScoreResult[j].totalMark * 100 / totalHomeworkMark).toFixed(2);
                    }
                    else {
                        homeworkGrade[i] = 0;
                    }
                }
            }
            else {
                for (var i = 0; i < takeTwoGrade.length; i++) {
                    homeworkGrade[i] = 100;
                }
            }
            var data = {
                takeTwoGrade: takeTwoGrade,
                homeworkGrade: homeworkGrade
            }
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
            }
            // 因为现在学生的作业成绩无法直接修改，所以下面的语句被注释掉了
            // else if (sql.changeType == "homeworkGrade") {
            //     ret = await conn.query("update take set homeworkGrade = ? where classID = ? and studentID = ?",
            //         [parseInt(sql.newScore), sql.classID, sql.studentID]);
            // }
            else {
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
}

module.exports = Course;