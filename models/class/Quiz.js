var pool = require('../mysql/ConnPool');
var config = require('../statics/config');

class Quiz {

    /**
     * 获取某门课程对应的题库
     * 
     * @param {string} courseNumber 
     * @return 返回题库JSON数组，否则返回null
     */
    async getProblemBank(courseNumber) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from problem_bank where courseNumber = ?", [courseNumber]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    /**
     * 向题库中添加试题
     * 
     * @param {Object} problem 
     * @note answer应该在前端做好数值映射，选项非空判断也应该在前端完成
     * @return 正确插入返回null, 出现异常返回报错信息
     */
    async createProblem(courseNumber, problem, submitter) {
        let { description, choiceA, choiceB, choiceC, choiceD, answer } = problem;
        try {
            var conn = await pool.getConnection();
            await conn.query("insert into problem_bank(courseNumber, description, choiceA, choiceB, choiceC, choiceD, answer, submitter) \
                values(?, ?, ?, ?, ?, ?, ?, ?)", [courseNumber, description, choiceA, choiceB, choiceC, choiceD, answer, submitter]);
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 删除试题
     * 
     * @param {int} problemID 
     * @param {string} courseNumber 
     * @return 正确插入返回null, 出现异常返回报错信息
     */
    async deleteProblem(problemID, courseNumber) {
        try {
            var conn = await pool.getConnection();
            await conn.query("delete from problem_bank where problemID = ? and courseNumber = ?", [problemID, courseNumber]);
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 新建小测
     * 
     * @param {string} quizName
     * @param {string} classID 
     * @param {Date} startTime 
     * @param {Date} closeTime
     * @return 正确插入返回null, 出现异常返回报错信息
     */
    async createQuiz(quizName, classID, startTime, closeTime) {
        try {
            var conn = await pool.getConnection();
            await conn.query("insert into class_project(projectName, classID, startTime, closeTime, isGroupWork) values (?, ?, ?, ?, ?)",
                [quizName, classID, startTime, closeTime, config.PROJECT_TYPE_QUIZ]);
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 删除小测
     * 
     * @param {int} classProjectID
     * @return 正确插入返回null, 出现异常返回报错信息
     */
    async deleteQuiz(classProjectID) {  //check isGroupWork = 3
        try {
            var conn = await pool.getConnection();
            await conn.query("delete from class_project where classProjectID = ? and isGroupWork = ?", [classProjectID, config.PROJECT_TYPE_QUIZ]);
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 获取教学班的所有quiz
     * 
     * @param {string} classID 
     */
    async getQuiz(classID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select classProjectID as value, projectName as name from class_project where classID = ? and isGroupWork = ?", [classID, config.PROJECT_TYPE_QUIZ]);
            return ret[0];
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            conn.release();
        }
    }

    async insertProblemToQuiz(classProjectID, problemID, score) {
        try {
            var conn = await pool.getConnection();
            await conn.query("insert into project_problem(classProjectID, problemID, score) values (?, ?, ?)", [classProjectID, problemID, score]);
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    async removeProblemFromQuiz(classProjectID, problemID) {
        try {
            var conn = await pool.getConnection();
            await conn.query("delete from project_problem where classProjectID = ? and problemID = ?", [classProjectID, problemID]);
            return null;
        } catch (err) {
            console.log(err);
            return err.message;
        } finally {
            conn.release();
        }
    }

    /**
     * 获取小测题
     * 
     * @param {String} classProjectID 
     */
    async getQuizProblems(classProjectID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from project_problem natural join problem_bank where classProjectID = ?", [classProjectID]);
            return ret[0];
        } catch (err) {
            console.log(err);
        } finally {
            conn.release();
        }
    }

    /**
     * 提交小测
     * 
     * @param {struct} answers 
     */
    async submitQuiz(answers) {
        let { studentID, classProjectID, mark } = answers;
        try {
            var conn = await pool.getConnection();
            await conn.query("insert into class_project_score(classProjectID, studentID, commitTime, mark) values (?, ?, CURRENT_TIMESTAMP, ?)", [classProjectID, studentID, mark]);
            return 1;
        } catch (err) {
            console.log(err);
            return 0;
        } finally {
            conn.release();
        }
    }

    /**
     * 获取用户是否做过了这个小测
     * 
     * @param {*} studentID 
     * @param {*} classProjectID 
     */
    async getUserQuizStatus(studentID, classProjectID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from class_project_score where classProjectID = ? and studentID = ?", [classProjectID, studentID]);
            if (ret[0].length > 0) {
                return 1;
            } else {
                return -1;
            }
        } catch (err) {
            console.log(err);
            return 0;
        } finally {
            conn.release();
        }
    }

    /**
     * 根据classProjectID获得project的信息
     * 
     * @param {String} classProjectID 
     */
    async getQuizName(classProjectID) {
        try {
            var conn = await pool.getConnection();
            var ret = await conn.query("select * from class_project where classProjectID = ?", [classProjectID]);
            return ret[0];
        } catch (err) {
            console.log(err);
        } finally {
            conn.release();
        }
    }

}

module.exports = Quiz;